# Parent Window Redirection

### What's the vulnerability?

If you use a link with `target="_blank"` to open a page in a new window, the new window is able to access and modify the parent window's location through `window.opener.location`. An attacker could use this to redirect a user to a phishing page and the user would ultimately think they are still in the same context as before.

### How can the vulnerability be tested?

Click on the the GitHub logo in the footer of the [home page] or [login page]. Once the window opened, open the developer tools and enter in the JavaScript code the following:

```js
window.opener.location = 'https://moin.world'
```

You should see that the page that opened the GitHub page was redirected to https://moin.world. 

### How can this be fixed?

For most modern browsers but IE and Edge the fix is to add an attribute to the link `rel="noopener"` to block the child page to access the `window.opener` property. For IE and Edge we can either [use a script](https://mathiasbynens.github.io/rel-noopener/#recommendations) or use the `rel="noreferrer"` attribute. These two can be combined. So just make sure all your `target="_blank"` links are formatted the following way:

```html
<a href="https://moin.world" target="_blank" rel="noopener noreferrer">Check out my blog</a>
```

### Resources/References
- [Mathias Bynens: About `rel=noopener`](https://mathiasbynens.github.io/rel-noopener/)
- [The `target=_blank` Vulnerability by Example](https://dev.to/ben/the-targetblank-vulnerability-by-example)

[home page]: https://onesie.life/home
[login page]: https://onesie.life/login