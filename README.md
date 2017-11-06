<p style="font-size: 3em" align="center">💖</p>
<h1 align="center">onesie.life</h1>
<p align="center">An <em>intentionally insecure</em> web application to highlight different web security concepts</p>

---

This is an example application used by [Dominik Kundel](https://github.com/dkundel) in his [Introduction to Web Security talk](https://github.com/dkundel/intro-web-security). It has intenionally a [set of vulnerabilities](#vulnerabilities) to highlight different attack vectors and as well as ways to fix them.

If you find any additional attack vectors, feel free to create an issue for it or alternatively create a pull request for this README to add it to the [list of vulnerabilities](#vulnerabilities).

## Vulnerabilities
There is a variety of vulnerabilites present in this application. Check out the respective docs to learn more about them.

- [Clickjacking](docs/vulnerabilities/clickjacking.md)
- [Cross Site Request Forgery (CSRF)](docs/vulnerabilities/cross-site-request-forgery.md)
- [Cross Site Scripting (XSS)](docs/vulnerabilities/cross-site-scripting.md)
- [JSON Web Token (JWT)](docs/vulnerabilities/json-web-token.md)
- [Poor JSONP implementations](docs/vulnerabilities/jsonp.md)
- [Parent Window Redirection](docs/vulnerabilities/window-redirection.md)

## Security Measurements

- [Content Security Policy](docs/security/content-security-policy.md)

## Resources

- [Open Web Application Security Project (OWASP)](https://www.owasp.org/index.php/Main_Page). Extensive Wiki around all web security related topics
- [OWASP Common Attacks List](https://www.owasp.org/index.php/Category:Attack)
- [Slides of my intro to web security talk](https://github.com/dkundel/intro-web-security)
- [Google Web Fundamentals Security](https://developers.google.com/web/fundamentals/security/)
- [Gruyere Codelab](https://google-gruyere.appspot.com/). A Codelab by Google teaching you different things around security
- [SecurityHeaders.io](https://securityheaders.io). Analyzes the HTTP headers of your application for security aspects
- [`goof`](https://github.com/snyk/goof). A vulnerable demo app by Synk.io
- [`helmet`](https://helmetjs.github.io/). A Node.js module to set security related headers for your [`express`](https://npm.im/express) server
- [Snyk.io](https://snyk.io). A tool to detect vulnerabilities in your projects by scanning your dependencies
- [Greenkeeper.io](https://greenkeeper.io/). A tool to keep your dependencies up to date

## Setup

This application is built with Node.js and uses Twilio Sync as a database at the moment. 

### Prerequisites
- [Node.js](https://nodejs.org) & [npm](https://npmjs.com)
- A Twilio account - [Sign up here](https://www.twilio.com/try-twilio)

Make sure you have the following values [stored in your environment variables](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html):

```bash
# Your Twilio Account SID
TWILIO_ACCOUNT_SID=
# A Twilio API Key
TWILIO_API_KEY=
# A Twilio API Secret
TWILIO_API_SECRET=
# The SID of your Twilio Sync Service (can be 'default')
TWILIO_SYNC_SERVICE=default
```

### Setup

```bash
git clone git@github.com:dkundel/onesie-life.git
cd onesie-life
npm install
```

### Start Server

```bash
npm start
```

### Open Page http://localhost:3000

## License

MIT

## Contributors

- [Dominik Kundel](https://github.com/dkundel)