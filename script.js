// Configuration
const API_ENDPOINT = '/api/main'; // Change this to your actual API endpoint

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const urlInput = document.getElementById('urlInput');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultInput = document.getElementById('resultInput');
const copyBtn = document.getElementById('copyBtn');
const previewImage = document.getElementById('previewImage');
const toast = document.getElementById('toast');

// Upload area click handler
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File input change handler
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Show alert that direct upload isn't supported
        showToast('Direct upload not supported. Please use an image hosting service like Imgur, then paste the URL below.');
        fileInput.value = ''; // Reset input
    }
});

// Drag and drop handlers
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
    showToast('Direct upload not supported. Please use an image hosting service like Imgur, then paste the URL below.');
});

// Generate button handler
generateBtn.addEventListener('click', generateLink);

// Enter key handler for input
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateLink();
    }
});

// Copy button handler
copyBtn.addEventListener('click', copyToClipboard);

// Generate link function
function generateLink() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showToast('Please enter an image URL');
        return;
    }
    
    if (!isValidUrl(url)) {
        showToast('Please enter a valid URL');
        return;
    }
    
    // Encode URL to base64
    const encodedUrl = btoa(url);
    
    // Generate the shareable link
    const shareableLink = `${window.location.origin}${API_ENDPOINT}?url=${encodedUrl}`;
    
    // Display result
    resultInput.value = shareableLink;
    resultSection.classList.add('show');
    
    // Load preview image
    previewImage.src = url;
    previewImage.onerror = () => {
        showToast('Could not load image preview. Link generated successfully.');
    };
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Copy to clipboard function
function copyToClipboard() {
    resultInput.select();
    resultInput.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(resultInput.value).then(() => {
        // Change button text temporarily
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        
        showToast('Link copied to clipboard!');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy. Please try manually.');
    });
}

// Validate URL function
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
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Auto-focus on URL input when page loads
window.addEventListener('load', () => {
    urlInput.focus();
});
