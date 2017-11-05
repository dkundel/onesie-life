# Insecure JSON Web Token (JWT)

__What's the vulnerability?__

The application uses [JSON Web Tokens] (JWT) to handle the sessions of users. This is a common way to do it as it doesn't require any session storage on the application side. The token is transmitted to the user via a cookie with the name `authToken`. The current implementation has a significant vulnerability that allows an attacker to impersonate another user and gain admin access rights.

__How can the vulnerability be tested?__

Open your browser and navigate to the [login page]. Open the developer tools and type in the following code into the JavaScript console:

```js
Cookies.set('authToken', 'INSERT JWT TOKEN');
```

Now navigate to the [home page] and you should be logged in as indicated at the top. 

Inspect the token we set on jwt.io and modify the payload attributes `role` to `admin` or `sub` to any username you would like.

__What causes this vulnerability?__

_a) Vulnerable JWT implementation_

The [JWT spec] is broken by itself since it says that the algorithm that is used for the signature part of a JWT should be determined in the header of the token. This part is not encrypted and can be easily modified. The [JWT spec] also offers a valid algorithm for the signature called `none`. If a library is strictly implemented according to the spec it is possible to circumvent the verification step by creating a token with the following header:

```json
{
  "alg": "none"
}
```

We can now turn this into a `base64` encoded string, replace the original header and remove the signature and have a valid token.

In our case we are using [`jsonwebtoken`](npm.im/jsonwebtoken) implementation at version `0.4.0` which is implemented according to spec but does contain exactly this vulnerability.

_b) Insecure use of cookies_

The application is using cookies that should be `HttpOnly` meaning they should not be accessible in JavaScript as they are not needed there. Additionally they should be signed with a secret key to make sure they can't be tempered with.

__How can this be fixed?__

_a) Vulnerable JWT implementation_

1. Use a secure implementation of the JWT spec. They should allow to specify a set of valid algorithms to disallow `none` or algorithms you are not expecting. The latest version of [jsonwebtoken](https://npm.im/jsonwebtoken) fullfils this criteria
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