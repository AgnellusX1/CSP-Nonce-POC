# CSP Project - Security Demonstration with Content Security Policy

A web application demonstrating Content Security Policy (CSP) implementation and XSS vulnerability mitigation with a Node.js/Express backend serving a frontend with intentional vulnerabilities for educational purposes.

> **⚠️ SECURITY NOTICE**: This project contains intentional security vulnerabilities for educational demonstration. DO NOT deploy to production environments.

## 🎯 Purpose

This project demonstrates:
- **Content Security Policy (CSP)** implementation with nonce-based script protection
- **XSS vulnerability** in data display (intentional for educational purposes)
- **Defense-in-depth** security approach - how CSP blocks attacks even with vulnerable code
- **Secure vs. insecure** coding practices comparison

## 🔒 What is Content Security Policy (CSP)?

Content Security Policy (CSP) is a security standard that helps prevent:
- Cross-Site Scripting (XSS) attacks
- Code injection attacks  
- Clickjacking
- Data injection attacks

CSP works by controlling which resources (scripts, styles, images, etc.) the browser is allowed to load and execute.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   git clone https://github.com/AgnellusX1/CSP.git
   cd CSP/csp-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
csp-project/
├── backend/
│   └── server.js          # Express server with CSP middleware
├── frontend/
│   ├── index.html         # Main HTML page
│   ├── styles.css         # CSS styles
│   └── script.js          # JavaScript functionality
├── package.json           # Project configuration
└── README.md             # This file
```

## 🛡️ CSP Policy Implemented

The server implements the following CSP directives with **nonce-based security**:

- **`default-src 'self'`** - Only allow resources from the same origin
- **`script-src 'self' 'nonce-{random}'`** - Allow same-origin scripts and scripts with valid nonce
- **`style-src 'self' 'unsafe-inline'`** - Allow same-origin and inline styles
- **`img-src 'self' data: https: http:`** - Allow images from same-origin, data URLs, and HTTP/HTTPS
- **`font-src 'self'`** - Only allow fonts from same-origin
- **`connect-src 'self'`** - Only allow AJAX/fetch requests to same-origin
- **`frame-ancestors 'none'`** - Prevent iframe embedding
- **`base-uri 'self'`** - Restrict base element URLs
- **`form-action 'self'`** - Only allow forms to submit to same-origin

**🔒 Security Enhancement**: This implementation uses **cryptographic nonces** for scripts, preventing most XSS attacks while allowing legitimate application functionality.

## 🔍 Additional Security Headers

The server also sets these security headers:

- **X-Frame-Options: ALLOWALL** - Allow iframe embedding for testing
- **X-Content-Type-Options: nosniff** - Prevent MIME type sniffing
- **X-XSS-Protection: 0** - Disabled for XSS testing demonstration
- **Referrer-Policy: no-referrer** - Minimal referrer information

## 🚨 Intentional Vulnerability

**⚠️ EDUCATIONAL PURPOSE ONLY**

This application contains an **intentional XSS vulnerability** in the "Data Storage Demo" section:
- User input is stored in localStorage
- **Stored data is displayed without HTML sanitization**
- Demonstrates how CSP can mitigate XSS even with vulnerable code

### Testing the Vulnerability

1. **Enter HTML/JavaScript** in the input field: `<img src=x onerror=alert('XSS')>`
2. **Click "Save Data"**
3. **Observe**: HTML is injected but JavaScript execution is **blocked by CSP**
4. **Check browser console** for CSP violation messages

This demonstrates **defense-in-depth** security principles.

## 🧪 Testing CSP & Features

1. **Open Developer Tools** in your browser (F12)
2. **Check the Network tab** - You'll see the CSP headers with unique nonces in the response
3. **Check the Console** - CSP violations (if any) will be logged here
4. **Try the API Status button** - Demonstrates same-origin AJAX requests
5. **Test the Data Storage Demo** - Enter text and save it to see localStorage functionality

### Features to Test

- **Data Persistence**: Enter text in the input field and click "Save Data" - it will persist across page refreshes
- **Nonce Security**: View page source to see unique nonces in script and style tags
- **CSP Compliance**: All functionality works without `'unsafe-inline'` directives
- **XSS Protection**: Try injecting `<script>alert('XSS')</script>` - it will be blocked by CSP

### Verifying CSP Headers

In the browser's Developer Tools Network tab, look for these headers in the response:

```
Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' data:; script-src 'self' 'nonce-{unique-nonce}'; style-src 'self' 'unsafe-inline' data:; img-src 'self' data: https: http:; font-src 'self' data:; connect-src 'self' data:; frame-src 'self' data:; object-src 'self' data:; base-uri 'self' data:; form-action 'self' data:
```

Each nonce will be different on every page load, providing enhanced security.

## 🔧 API Endpoints

- **GET `/`** - Serves the main HTML page with dynamically generated nonces
- **GET `/api/status`** - Returns server status and CSP information

## 📝 Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload

## 🚫 What CSP Blocks

With this policy, the following would be blocked:

- External JavaScript from other domains (e.g., CDN scripts)
- External CSS from other domains  
- Images from untrusted sources
- Embedding this page in iframes
- Form submissions to external domains
- WebSocket connections to other origins
- Inline scripts without proper nonce
- Dynamic script creation and execution

## ⚡ What CSP Allows

The current policy allows:

- Same-origin JavaScript files with nonce
- Inline CSS styles (for styling flexibility)
- Images from any HTTPS/HTTP source and data URLs
- Same-origin AJAX requests
- localStorage and other browser APIs

## 🔧 Customizing CSP

To modify the CSP policy, edit the `cspMiddleware` function in `backend/server.js`. You can:

- Add trusted domains: `script-src 'self' https://trusted-domain.com`
- Allow specific inline scripts with nonces or hashes
- Add report-uri to monitor CSP violations
- Adjust policies based on your application needs

## 🐛 Troubleshooting

**Common issues:**

1. **Resources not loading**: Check if they're from the same origin or allowed by CSP
2. **Inline scripts blocked**: The current policy uses nonces for inline scripts - check nonce implementation
3. **External resources blocked**: Add trusted domains to the appropriate CSP directive

**Check CSP violations:**
- Open browser Developer Tools
- Look at the Console tab for CSP violation messages
- Check Network tab to see if resources are being blocked

## 📚 Learn More

- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Content Security Policy Reference](https://content-security-policy.com/)

## 🎯 Next Steps

To enhance this basic setup:

1. **✅ Implemented nonces** for inline scripts instead of `'unsafe-inline'` 
2. **Add CSP reporting** to monitor violations
3. **Further tighten policies** by restricting more resource types
4. **Add HTTPS** in production
5. **Implement additional security headers**

## 📜 License

MIT License - see LICENSE file for details.

## ⚠️ Disclaimer

This project is for **educational purposes only**. It contains intentional security vulnerabilities to demonstrate CSP effectiveness. **Do not use in production environments**. The authors are not responsible for any misuse of this code.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Support

If you have questions about this project or CSP implementation, please open an issue on GitHub.