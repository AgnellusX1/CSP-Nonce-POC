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
    
    // CSP policy with strict-dynamic for enhanced security
    const csp = [
        "default-src 'self'",
        `script-src 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline'`, // strict-dynamic disables host-based allowlisting, only nonce needed
        "style-src 'self' 'unsafe-inline' data:",  // Allow inline styles for flexibility
        "img-src 'self' data: https: http:",       // Allow images from anywhere
        "font-src 'self' data:",
        "connect-src 'self' data:",
        "frame-src 'self' data:",               // Allow frames for testing
        "object-src 'self' data:",              // Allow objects
        "base-uri 'self' data:",
        "form-action 'self' data:",
        "report-uri https://browserstack.uriports.com/reports/report"
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

// Serve the main page with nonce replacement
app.get('/', (req, res) => {
    // Read the HTML template
    const htmlPath = path.join(__dirname, '../frontend/index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Replace nonce placeholders with the actual nonce
    const nonce = res.locals.nonce;
    htmlContent = htmlContent.replace(/{{NONCE}}/g, nonce);
    
    // Send the modified HTML
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
});

// Serve static files from frontend directory (excluding index.html)
app.use(express.static(path.join(__dirname, '../frontend'), {
    index: false // Don't serve index.html as static file
}));

// Reflected XSS testing endpoint
app.get('/reflect', (req, res) => {
    const userInput = req.query.input || '';
    const name = req.query.name || 'Anonymous';
    
    // Intentionally vulnerable to reflected XSS - directly injecting user input
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Reflected XSS Test</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
            .container { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
            .result { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; margin: 10px 0; }
            a { color: #ffeb3b; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔄 Reflected XSS Test Results</h1>
            <div class="result">
                <h3>Hello, ${name}!</h3>
                <p><strong>Your input was:</strong> ${userInput}</p>
                <p><em>Note: This content is directly reflected without sanitization for XSS testing purposes.</em></p>
            </div>
            <a href="/">← Back to Main Page</a>
        </div>
    </body>
    </html>
    `;
    
    res.send(html);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Content Security Policy is active');
    console.log('Frontend served from /frontend directory');
});

module.exports = app;