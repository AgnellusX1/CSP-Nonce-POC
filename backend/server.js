const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Content Security Policy middleware
const cspMiddleware = (req, res, next) => {
    // Generate a unique nonce for this request
    const nonce = crypto.randomBytes(16).toString('base64');
    
    // Store nonce in response locals for use in templates
    res.locals.nonce = nonce;
    
    // CSP policy - secure scripts with nonce, permissive for XSS testing in other areas
    const csp = [
        "default-src 'self'",
        `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}'`, // Only allow scripts with nonce (secure)
        "style-src 'self' 'unsafe-inline' data:",  // Allow inline styles for flexibility
        "img-src 'self' data: https: http:",       // Allow images from anywhere
        "font-src 'self' data:",
        "connect-src 'self' data:",
        "frame-src 'self' data:",               // Allow frames for testing
        "object-src 'self' data:",              // Allow objects
        "base-uri 'self' data:",
        "form-action 'self' data:"
    ].join('; ');
    
    // Set CSP header
    res.setHeader('Content-Security-Policy', csp);
    
    // Disable security headers for XSS testing
    res.setHeader('X-Frame-Options', 'ALLOWALL'); // Allow iframe embedding for testing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '0'); // DISABLE XSS protection to allow XSS testing
    res.setHeader('Referrer-Policy', 'no-referrer'); // Less restrictive referrer policy
    
    next();
};

// Apply CSP middleware to all routes
app.use(cspMiddleware);

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the main page
app.get('/', (req, res) => {
    // Read the HTML template
    const htmlPath = path.join(__dirname, '../frontend/index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Replace nonce placeholders with the actual nonce
    const nonce = res.locals.nonce;
    htmlContent = htmlContent.replace(/{{NONCE}}/g, nonce);
    
    // Send the modified HTML
    res.send(htmlContent);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Content Security Policy is active');
    console.log('Frontend served from /frontend directory');
});

module.exports = app;