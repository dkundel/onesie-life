# Insecure JSON Web Token (JWT)

### What's the vulnerability?

The application uses [JSON Web Tokens] (JWT) to handle the sessions of users. This is a common way to do it as it doesn't require any session storage on the application side. The token is transmitted to the user via a cookie with the name `authToken`. The current implementation has a significant vulnerability that allows an attacker to impersonate another user and gain admin access rights.

### How can the vulnerability be tested?

Open your browser and navigate to the [login page]. Open the developer tools and type in the following code into the JavaScript console:

```js
Cookies.set('authToken', 'INSERT JWT TOKEN');
```

Now navigate to the [home page] and you should be logged in as indicated at the top. 

Inspect the token we set on jwt.io and modify the payload attributes `role` to `admin` or `sub` to any username you would like.

### What causes this vulnerability?

_a) Vulnerable JWT implementation_

The [JWT spec] suggests a variety of algorithms that can be used for the signature. One valid algorithm for the signature is called `none` intended for tokens where the integraty has been verified in a different way. The algorithm is specified in the header of the token. Note that the header is not encrypted and can therefore be altered. If a library is strictly implemented according to the spec and determines the algorithm based on the `alg` field in the header it is possible to circumvent the verification step by creating a token with the following header:

```json
{
  "alg": "none"
}
```

We can now turn this into a `base64` encoded string, replace the original header and remove the signature and have a valid token.

In our case we are using [`jsonwebtoken`](npm.im/jsonwebtoken) implementation at version `0.4.0` which is implemented according to spec but does contain exactly this vulnerability.

_b) Insecure use of cookies_

The application is using cookies that should be `HttpOnly` meaning they should not be accessible in JavaScript as they are not needed there. Additionally they should be signed with a secret key to make sure they can't be tempered with.

### How can this be fixed?

_a) Vulnerable JWT implementation_

1. Use a secure implementation of the [JWT spec]. They should allow to specify a set of valid algorithms to disallow `none` or algorithms you are not expecting. The latest version of [jsonwebtoken](https://npm.im/jsonwebtoken) fullfils this criteria
2. Always keep up to date with the version to avoid exposing known security vulnerabilities
3. Consider replacing the JWT header on the server side with the one you expect. 

_b) Insecure use of cookies_

1. Use `HttpOnly` cookies
2. Use signed and secure cookies

```js
req.cookie('authToken', token, { 
  httpOnly: true,
  secure: true,
  signed: true
});
```

### Resources/References
- [JWT spec]
- [Blog post "Stop using JWT for sessions"](http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/)
- [Auth0: Critical Vulnerability in JWT libraries](https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/)
- [Troy Hunt: C is for Cookie, H is for Hacker](https://www.troyhunt.com/c-is-for-cookie-h-is-for-hacker/)
- [OWASP: JWT Cheat Sheet for Java](https://www.owasp.org/index.php/JSON_Web_Token_(JWT)_Cheat_Sheet_for_Java)
- [OWASP: `HttpOnly` cookies](https://www.owasp.org/index.php/HttpOnly)
- [MDN: `Set-Cookie` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [CodingHorror: Protecting your cookies `HttpOnly`](https://blog.codinghorror.com/protecting-your-cookies-httponly/)

[JWT spec]: https://tools.ietf.org/html/rfc7519
[JSON Web Tokens]: https://jwt.io
[home page]: https://onesie.life/home
[login page]: https://onesie.life/login
