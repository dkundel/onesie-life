# Content Security Policy (CSP)

[Content Security Policy] is a security measurement that helps you to detect and mitigate certain set of attacks including [XSS](../vulnerabilities/cross-site-scripting.md). It allows you to specify rules for which content should be loaded by the browser. These rules can be set as an [HTTP header `Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) or as a [`meta` tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta). 

The following is an example of such a header:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'nonce-NWo2+pmewRLPWqpsgv6J2w==';
  style-src 'nonce-NWo2+pmewRLPWqpsgv6J2w==';
  object-src 'none';
  img-src 'self' api.adorable.io;
  font-src 'self' fonts.gstatic.com;
  block-all-mixed-content;
  report-uri /csp-report;
```

It enforces the following rules:

- `script`s and `style`s should only be loaded if they contain a certain nonce that should differ on every request. A valid `script` would be:
```html
<script src="some-script.js" nonce="NWo2+pmewRLPWqpsgv6J2w=="></script>
```
- `object`s are entirely banned
- `img`s should only be loaded from the domain of the page or from `api.adorable.io`
- `font`s should only be loaded from the domain of the page or from `fonts.gstatic.com`
- All mixed content (i.e. `http` content on the `https` page) should be blocked
- Any violations should be reported to `/csp-report` via a POST request.

You can find more configuration options in the [MDN documenation about CSP]. Not every CSP configuration is equally secure. You should check out the paper by Google: [CSP Is Dead, Long Live CSP! On the Insecurity of
Whitelists and the Future of Content Security Policy]. 

__CSP should never be your security strategy but rather a safety net.__

### Resources/References
- [MDN documenation about CSP]
- [OWASP: Content Security Policy](https://www.owasp.org/index.php/Content_Security_Policy)
- Paper: [CSP Is Dead, Long Live CSP! On the Insecurity of
Whitelists and the Future of Content Security Policy]
- [GitHub's CSP journey](https://githubengineering.com/githubs-csp-journey/)

[Content Security Policy]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
[MDN documenation about CSP]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

[CSP Is Dead, Long Live CSP! On the Insecurity of
Whitelists and the Future of Content Security Policy]: https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45542.pdf