# Clickjacking

### What's the vulnerability?

Clickjacking is an attack where the attacker is trying to make a user belief they are interacting with one site while in reality they are clicking on another. This attack is performed by laying the page they want the user to interact with on top of the page they want the user to believe to be clicking on. They then set the `opacity` to `0` to make the user only see the phishing UI. 

By strategically laying buttons above each other they can then trick the user into clicking on buttons they would otherwise probably wouldn't click.

![Clickjacking Example](https://www.owasp.org/images/8/84/Clickjacking_description.png)
<sub>Source: https://www.owasp.org/index.php/Testing_for_Clickjacking_(OTG-CLIENT-009)</sub>

### How can the vulnerability be tested?

If your page can be loaded in an `frame`/`iframe` it can potentially be used for clickjacking attacks. Try loading the [home page] in an iframe by adding this code to any page:

```html
<iframe src="https://onesie.life/home"></iframe>
```

### What causes this vulnerability?

By default any page can be iframed unless the browser is explicitly told not to. Since CSS allows you to layer things on top of each other and make things transparent, clickjacking can easily be achieved.

### How can this be fixed?

You can tell the browser explictly not to load a page in a frame in two ways. One is by using a [CSP policy](../security/content-security-policy.md) the more browser compatible one, though, is using the `X-Frame-Options` HTTP header.

Make sure your server sends the following HTTP header with every response:

```http
X-Frame-Options: deny
```

This will by default block every case of framing your page. You can make this more permissive to allow framing on your own page or whitelist certain URLs. But unless this is really essential, you should just generally ban framing. 

You can test the header in action by trying to frame `https://onesie.life/secure/home` instead.

Also be aware that framebusting scripts as sometimes suggested can be insufficient in most cases as explained in [this study](https://www.owasp.org/index.php/Testing_for_Clickjacking_(OTG-CLIENT-009)).

### Resources

- [OWASP: Clickjacking Defense Cheat Sheet](https://www.owasp.org/index.php/Clickjacking_Defense_Cheat_Sheet)
- [OWASP: Testing for clickjacking](https://www.owasp.org/index.php/Testing_for_Clickjacking_(OTG-CLIENT-009))
- [OWASP: Research on Framebusting](https://www.owasp.org/images/0/0e/OWASP_AppSec_Research_2010_Busting_Frame_Busting_by_Rydstedt.pdf)
- [MDN page on `X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)


[home page]: https://onesie.life/home
[login page]: https://onesie.life/login