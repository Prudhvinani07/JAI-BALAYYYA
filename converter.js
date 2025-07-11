// Amazon Affiliate Link Converter - Browser Compatible Version
// This version works directly in the browser without Node.js dependencies

// Configuration
const AFFILIATE_TAG = 'jaibalayya03-21'; // Your Amazon affiliate tag

// Function to extract ASIN from various Amazon URL formats
function extractAsin(url) {
    // Remove any whitespace
    url = url.trim();
    
    // Common Amazon URL patterns
    const patterns = [
        // Standard product URLs
        /\/dp\/([A-Z0-9]{10})/i,
        /\/gp\/product\/([A-Z0-9]{10})/i,
        /\/product\/([A-Z0-9]{10})/i,
        
        // Amazon short URLs
        /\/([A-Z0-9]{10})(?:\/|\?|$)/i,
        
        // Amazon URLs with ASIN parameter
        /[?&]asin=([A-Z0-9]{10})/i,
        
        // Other Amazon URL formats
        /amazon\.[\w.]+\/.*\/([A-Z0-9]{10})/i
    ];
    
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
}

// Function to validate if URL is an Amazon URL
function isAmazonUrl(url) {
    const amazonDomains = [
        'amazon.com',
        'amazon.co.uk',
        'amazon.de',
        'amazon.fr',
        'amazon.it',
        'amazon.es',
        'amazon.ca',
        'amazon.com.au',
        'amazon.in',
        'amazon.co.jp',
        'amazon.com.br',
        'amazon.com.mx',
        'amzn.to',
        'amzn.com'
    ];
    
    return amazonDomains.some(domain => url.includes(domain));
}

// Function to extract domain from URL for regional handling
function getAmazonDomain(url) {
    const match = url.match(/amazon\.([\w.]+)/i) || url.match(/(amzn\.\w+)/i);
    return match ? match[0] : 'amazon.com';
}

// Function to generate affiliate link
function generateAffiliateLink(asin, originalUrl) {
    const domain = getAmazonDomain(originalUrl);
    return `https://www.${domain}/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

// Main function to convert URL to affiliate link
function convertToAffiliateLink(inputUrl) {
    try {
        // Basic input validation
        if (!inputUrl || typeof inputUrl !== 'string') {
            return {
                success: false,
                error: 'Please enter a valid URL'
            };
        }
        
        // Add protocol if missing
        let url = inputUrl.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        // Check if it's an Amazon URL
        if (!isAmazonUrl(url)) {
            return {
                success: false,
                error: 'Please enter a valid Amazon product URL'
            };
        }
        
        // Extract ASIN
        const asin = extractAsin(url);
        if (!asin) {
            return {
                success: false,
                error: 'Could not extract product ID from this Amazon URL. Please check the URL format.'
            };
        }
        
        // Generate affiliate link
        const affiliateLink = generateAffiliateLink(asin, url);
        
        return {
            success: true,
            originalUrl: inputUrl,
            asin: asin,
            affiliateLink: affiliateLink
        };
        
    } catch (error) {
        return {
            success: false,
            error: 'An error occurred while processing the URL: ' + error.message
        };
    }
}

// Utility function to copy text to clipboard
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            textArea.remove();
            return success;
        }
    } catch (error) {
        console.error('Failed to copy text to clipboard:', error);
        return false;
    }
}

// Export functions for use in HTML
window.convertToAffiliateLink = convertToAffiliateLink;
window.copyToClipboard = copyToClipboard;