### Clickjacking

__What's the vulnerability?__
Clickjacking is an attack where the attacker is trying to make a user belief they are interacting with one site while in reality they are clicking on another. This attack is performed by laying the page they want the user to interact with on top of the page they want the user to believe to be clicking on. They then set the `opacity` to `0` to make the user only see the phishing UI. 

By strategically laying buttons above each other they can then trick the user into clicking on buttons they would otherwise probably wouldn't click.

![TODO ADD IMAGE OF CLICKJACKING OVERLAY]()

__How can the vulnerability be tested?__

If your page can be loaded in an `frame`/`iframe` it can potentially be used for clickjacking attacks. Try loading the [home page] in an iframe by adding this code to any page:

```html
<iframe src="https://onesie.life/home"></iframe>
```

__What causes this vulnerability?__
By default any page can be iframed unless the browser is explicitly told not to. Since CSS allows you to layer things on top of each other and make things transparent, clickjacking can easily be achieved.

__How can this be fixed?__
You can tell the browser explictly not to load a page in a frame in two ways. One is by using a [CSP policy](#content-security-policy) the more browser compatible one, though, is using the `X-Frame-Options` HTTP header.

Make sure your server sends the following HTTP header with every response:

```http
X-Frame-Options: deny
```

This will by default block every case of framing your page. You can make this more permissive to allow framing on your own page or whitelist certain URLs. But unless this is really essential, you should just generally ban framing.