### Cross-Site-Scripting (XSS)

__What's the vulnerability?__

XSS is a common attack where the attacker is able inject and execute code in your page's context. This is particullary dangerous because it allows to execute logic in your own security and user context. It could be used to perform actions on behalf of the user, capture the user's input to steal information or many more things.

__How can the vulnerability be tested?__

Detecting XSS in general can be easy or hard. In general you should be sceptical of potential XSS attacks anywhere where the user is able to inject content on the page in any shape. This could be via a URL query parameter in the case of a search field, by posting content into a database or similar things.

In our example the vulnerability lies in being able to post links to the [home page] that execute JavaScript on the page when clicked. You can try the following example. Post on the [home page] this content:

```markdown
[Click me](javascript&#58this;alert('Oh hai!'&#41;)
```

Now when you click the link it should create an alert prompt with `Oh hai!`.

__What causes this vulnerability?__

In our case we are using an old version of `marked` that has a vulnerability even when being executed in `secure` mode. While injecting HTML directly is blocked and a classic `[Click me](javascript:alert(1))` wouldn't work either, using some encoding and a browser bug/feature we are able to circumvent the sanitaziation process. While this one has been fixed in a newer version of `marked`, other vulnerabilites around `data:` links still exist.

Overall XSS vulnerabilities can be caused by different factors and most commonly by trusting a user input too much. This can also include dangerous CSS injections as shown in this [CSS-in-JS example].

__How can this be fixed?__

On the one hand you should make sure to not have old versions of your dependencies as they could have potential XSS attacks but generally speaking you should never trust your user's input. Even if you try to sanitize it, be aware of things like encodings to circumvent these sanitization processes.