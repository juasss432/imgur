// Configuration
const API_ENDPOINT = '/api/main';

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const urlInput = document.getElementById('urlInput');
const generateBtn = document.getElementById('generateBtn');
const resultCard = document.getElementById('resultCard');
const linkInput = document.getElementById('linkInput');
const copyBtn = document.getElementById('copyBtn');
const previewContent = document.getElementById('previewContent');
const toast = document.getElementById('toast');
const toastText = document.querySelector('.toast-text');

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorGlow = document.querySelector('.cursor-glow');

// Track mouse position
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Cursor hover effect on interactive elements
const interactiveElements = document.querySelectorAll('a, button, input, .upload-area, .icon-btn');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

// Upload area click
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        showToast('Direct upload not supported. Please use an image hosting service (like Imgur), then paste the URL below.');
        fileInput.value = '';
    }
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragging');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragging');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragging');
    showToast('Direct upload not supported. Please use an image hosting service (like Imgur), then paste the URL below.');
});

// Generate button
generateBtn.addEventListener('click', generateLink);

// Enter key on input
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateLink();
    }
});

// Copy button
copyBtn.addEventListener('click', copyToClipboard);

// Generate link function
function generateLink() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showToast('Please enter a media URL');
        return;
    }
    
    if (!isValidUrl(url)) {
        showToast('Please enter a valid URL');
        return;
    }
    
    // Encode URL to base64
    const encodedUrl = btoa(url);
    
    // Generate shareable link
    const shareableLink = `${window.location.origin}${API_ENDPOINT}?url=${encodedUrl}`;
    
    // Display result
    linkInput.value = shareableLink;
    resultCard.classList.add('show');
    
    // Load preview based on media type
    loadPreview(url);
    
    // Scroll to result
    setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Load preview function
function loadPreview(url) {
    previewContent.innerHTML = '';
    
    const extension = url.split('.').pop().toLowerCase().split('?')[0];
    const videoFormats = ['mp4', 'webm', 'ogg', 'mov'];
    const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    
    if (videoFormats.includes(extension)) {
        // Video preview
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.style.width = '100%';
        video.style.borderRadius = '8px';
        
        video.onerror = () => {
            showToast('Could not load video preview. Link generated successfully.');
            previewContent.innerHTML = '<p style="color: var(--text-secondary); padding: 40px;">Video preview unavailable</p>';
        };
        
        previewContent.appendChild(video);
    } else if (imageFormats.includes(extension) || url.includes('imgur') || url.includes('giphy')) {
        // Image/GIF preview
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Preview';
        img.style.borderRadius = '8px';
        
        img.onerror = () => {
            showToast('Could not load preview. Link generated successfully.');
            previewContent.innerHTML = '<p style="color: var(--text-secondary); padding: 40px;">Preview unavailable</p>';
        };
        
        previewContent.appendChild(img);
    } else {
        // Unknown format - try image first, fallback to message
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Preview';
        img.style.borderRadius = '8px';
        
        img.onerror = () => {
            previewContent.innerHTML = '<p style="color: var(--text-secondary); padding: 40px;">Preview unavailable for this format</p>';
        };
        
        previewContent.appendChild(img);
    }
}

// Copy to clipboard
function copyToClipboard() {
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(linkInput.value).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        
        showToast('Link copied to clipboard!');
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy. Please try manually.');
    });
}

// Validate URL
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Show toast notification
function showToast(message) {
    toastText.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Auto-focus URL input
window.addEventListener('load', () => {
    setTimeout(() => {
        urlInput.focus();
    }, 500);
});
