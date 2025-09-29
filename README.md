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
   cd CSP
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
CSP/
├── backend/
│   └── server.js          # Express server with CSP middleware
├── frontend/
│   ├── index.html         # Main HTML page
│   ├── styles.css         # CSS styles
│   └── script.js          # JavaScript functionality
├── package.json           # Project configuration
├── README.md             # This file
├── LICENSE               # MIT License
├── SECURITY.md           # Security policy
├── CONTRIBUTING.md       # Contribution guidelines
└── .gitignore           # Git ignore rules
```

## 🛡️ CSP Policy Implemented

The server implements the following CSP directives with **nonce-based security and strict-dynamic**:

- **`default-src 'self'`** - Only allow resources from the same origin
- **`script-src 'nonce-{random}' 'strict-dynamic' 'unsafe-inline'`** - Use nonces and strict-dynamic for enhanced script security
- **`style-src 'self' 'unsafe-inline' data:`** - Allow same-origin and inline styles
- **`img-src 'self' data: https: http:`** - Allow images from same-origin, data URLs, and HTTP/HTTPS
- **`font-src 'self' data:`** - Allow fonts from same-origin and data URLs
- **`connect-src 'self' data:`** - Allow AJAX/fetch requests to same-origin and data URLs
- **`frame-src 'self' data:`** - Allow frames for testing
- **`object-src 'self' data:`** - Allow objects from same-origin and data URLs
- **`base-uri 'self' data:`** - Restrict base element URLs
- **`form-action 'self' data:`** - Allow forms to submit to same-origin and data URLs
- **`report-uri https://browserstack.uriports.com/reports/report`** - CSP violation reporting

**🔒 Security Enhancement**: This implementation uses **cryptographic nonces** with **strict-dynamic** for scripts. The `strict-dynamic` directive allows trusted scripts to load other scripts dynamically without requiring individual nonces, while still preventing XSS attacks.

## 🔍 Additional Security Headers

The server also sets these security headers:

- **X-Frame-Options: ALLOWALL** - Allow iframe embedding for testing
- **X-Content-Type-Options: nosniff** - Prevent MIME type sniffing
- **X-XSS-Protection: 0** - Disabled for XSS testing demonstration
- **Referrer-Policy: no-referrer** - Minimal referrer information

## 🚨 Intentional Vulnerabilities

**⚠️ EDUCATIONAL PURPOSE ONLY**

This application contains **intentional XSS vulnerabilities** for security demonstration:

### 1. Stored XSS (Data Storage Demo)
- User input is stored in localStorage
- **Stored data is displayed without HTML sanitization**
- Demonstrates how CSP can mitigate XSS even with vulnerable code

### 2. Reflected XSS (Reflection Testing)
- User input is directly reflected in server response
- **No input sanitization on the `/reflect` endpoint**
- Shows how CSP blocks script execution in reflected content

### Testing the Vulnerabilities

**Stored XSS:**
1. **Enter HTML/JavaScript** in the input field: `<img src=x onerror=alert('XSS')>`
2. **Click "Save Data"**
3. **Observe**: HTML is injected but JavaScript execution is **blocked by CSP**

**Reflected XSS:**
1. **Enter payload** in reflection input: `<script>alert('Reflected XSS')</script>`
2. **Click "Test Reflection"**
3. **Observe**: Script tags are rendered but **blocked by CSP**

Both demonstrate **defense-in-depth** security principles where CSP acts as a safety net.

## 🧪 Testing CSP & Features

1. **Open Developer Tools** in your browser (F12)
2. **Check the Network tab** - You'll see the CSP headers with unique nonces in the response
3. **Check the Console** - CSP violations (if any) will be logged here
4. **Test the Data Storage Demo** - Enter text and save it to see localStorage functionality
5. **Test Reflected XSS** - Use the reflection testing section to test server-side XSS

### Features to Test

- **Data Persistence**: Enter text in the input field and click "Save Data" - it will persist across page refreshes
- **Stored XSS Protection**: Try injecting `<script>alert('XSS')</script>` in the data storage - it will be blocked by CSP
- **Reflected XSS Protection**: Use the reflection section to test various XSS payloads
- **Nonce Security**: View page source to see unique nonces in script tags
- **Strict-Dynamic**: Observe how legitimate scripts can still load additional resources while maintaining security

### Verifying CSP Headers

In the browser's Developer Tools Network tab, look for these headers in the response:

```
Content-Security-Policy: default-src 'self'; script-src 'nonce-{unique-nonce}' 'strict-dynamic' 'unsafe-inline'; style-src 'self' 'unsafe-inline' data:; img-src 'self' data: https: http:; font-src 'self' data:; connect-src 'self' data:; frame-src 'self' data:; object-src 'self' data:; base-uri 'self' data:; form-action 'self' data:; report-uri https://browserstack.uriports.com/reports/report
```

Each nonce will be different on every page load, providing enhanced security.

## 🔧 API Endpoints

- **GET `/`** - Serves the main HTML page with dynamically generated nonces
- **GET `/reflect`** - Reflected XSS testing endpoint (intentionally vulnerable)
  - Query parameters: `input` (text to reflect), `name` (user name)
  - Example: `/reflect?input=<b>Bold</b>&name=John`

## 📝 Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload

## 🚫 What CSP Blocks

With this policy, the following would be blocked:

- **External JavaScript** from other domains (due to strict-dynamic)
- **External CSS** from other domains  
- **Images** from untrusted sources (only self, data, http, https allowed)
- **Inline scripts** without proper nonce
- **Dynamic script creation** by untrusted sources
- **XSS attempts** via script injection
- **Embedding** this page in iframes (when frame-ancestors is set)

## ⚡ What CSP Allows

The current policy allows:

- **Nonce-based JavaScript** files and inline scripts
- **Dynamic script loading** by trusted scripts (via strict-dynamic)
- **Inline CSS** styles (for styling flexibility)
- **Images** from any HTTPS/HTTP source and data URLs
- **Same-origin resources** and data URLs
- **localStorage** and other browser APIs
- **CSP violation reporting** to external endpoint

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

1. **✅ Implemented nonces** for inline scripts with strict-dynamic
2. **✅ Added CSP reporting** to monitor violations  
3. **✅ Added reflected XSS testing** for comprehensive security demonstration
4. **Add HTTPS** in production
5. **Implement additional security headers** like HSTS
6. **Add hash-based CSP** for static inline scripts
7. **Implement CSP violation monitoring** and alerting

## 📜 License

MIT License - see LICENSE file for details.

## ⚠️ Disclaimer

This project is for **educational purposes only**. It contains intentional security vulnerabilities to demonstrate CSP effectiveness. **Do not use in production environments**. The authors are not responsible for any misuse of this code.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Support

If you have questions about this project or CSP implementation, please open an issue on GitHub.