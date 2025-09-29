# Security Policy

## ⚠️ Educational Purpose Only

**IMPORTANT SECURITY NOTICE**: This project is designed for educational and demonstration purposes only. It contains **intentional security vulnerabilities** to demonstrate how Content Security Policy (CSP) can mitigate Cross-Site Scripting (XSS) attacks.

## 🚨 Known Vulnerabilities

This application intentionally includes the following security vulnerabilities:

### 1. Cross-Site Scripting (XSS) in Data Storage
- **Location**: Data Storage Demo section (`displaySavedData()` function)
- **Issue**: User input is displayed without HTML sanitization
- **Demonstration**: Shows how CSP blocks script execution even with vulnerable code
- **Mitigation**: CSP with nonce-based script-src directive

### 2. Relaxed Security Headers
- **X-XSS-Protection**: Disabled (`0`) for demonstration purposes
- **X-Frame-Options**: Set to `ALLOWALL` instead of `DENY`
- **Purpose**: Allows testing of various attack vectors

## 🔒 Security Measures Implemented

### Content Security Policy (CSP)
- **script-src**: `'self' 'nonce-{random}'` - Only allows scripts with valid nonce
- **default-src**: `'self'` - Restricts resource loading to same origin
- **Nonce-based protection**: Unique cryptographic nonces generated per request

### Defense in Depth
This project demonstrates how CSP provides protection even when application code contains vulnerabilities.

## 🚫 Do NOT Use in Production

**NEVER deploy this application to a production environment.** It is designed for:
- Educational purposes
- Security training
- CSP demonstration
- Academic research

## 📋 Responsible Disclosure

If you discover additional security issues not related to the intentional vulnerabilities, please:

1. **Do NOT** create public issues for unintended security problems
2. Contact the project maintainer directly
3. Allow reasonable time for fixes before disclosure

## 🎓 Educational Use Guidelines

### Appropriate Uses
- ✅ Security education and training
- ✅ CSP implementation learning
- ✅ Academic coursework
- ✅ Security conference demonstrations
- ✅ Personal learning environments

### Inappropriate Uses
- ❌ Production deployment
- ❌ Hosting on public servers
- ❌ Corporate environments
- ❌ Any system with real user data
- ❌ Malicious testing on third-party systems

## 🔗 Security Resources

For learning more about web application security:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

## 📞 Contact

For questions about the educational use of this project, please open an issue on GitHub.

---

**Remember**: With great power comes great responsibility. Use this knowledge to build more secure applications, not to exploit vulnerabilities in systems you don't own.