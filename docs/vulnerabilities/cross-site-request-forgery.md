# Cross Site Request Forgery (CSRF / XSRF)

__What's the vulnerability?__

When posting on the newsfeed on the [home page] an HTTP `POST` request is performed with the message that should be posted. The cookies needed to authenticated the user are automatically sent with this request. 

The problem is that the browser will always send these cookies with any `POST` request even ones that originate from another page. An attacker can therefore implement a hidden form on their page that will perform a `POST` request on your behalf as long as you are logged in as a user.

__How can the vulnerability be tested?__

Make sure you are logged into a user by accessing the [home page]. Afterwards navigate to a page that has the following code on it:

```html
<body onload="document.forms.attack.submit()">
<form action="https://onesie.life/post" method="POST" name="attack">
  <input name="message" value="you were hacked!">
</form>
</body>
```

Once the page loads it will submit the form on your behalf and post `you were hacked!` on the newsfeed on your behalf. You can check this by going back to the [home page]. The message should be there.

__What causes this vulnerability?__

This is just a common behavior that appears when you are using forms submission requests and cookie-based authentication.

__How can this be fixed?__

The solution is to use CSRF tokens. Those are tokens that are unique per request. In order to have a valid `POST` request the same CSRF token has to be send via a cookie and either in the `POST` body or via an HTTP header. You can [learn more about this in this blog post](https://todo).