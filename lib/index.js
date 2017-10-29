require('marko/node-require');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csp = require('express-csp-header');
const express = require('express');
const jwt = require('jsonwebtoken');
const markoExpress = require('marko/express');
const path = require('path');

const { verifyLogin } = require('./shared/jwt');
const { init } = require('./shared/db');

const app = express();
const PORT = process.env.PORT || 3000;

const parsePost = bodyParser.urlencoded({ extended: false });

const cspMiddleware = csp({
  policies: {
    'default-src': [csp.SELF],
    'script-src': [csp.NONCE],
    'style-src': [csp.NONCE],
    'object-src': [csp.NONE],
    'img-src': [csp.NONCE, 'api.adorable.io'],
    'font-src': [csp.NONCE, 'fonts.gstatic.com'],
    'block-all-mixed-content': true
  },
  reportUri: '/csp-report'
});

app.use(
  express.static(path.join(__dirname, '../public'), {
    index: false,
    extensions: ['html']
  })
);
app.use(markoExpress());
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.url.indexOf('/secure') !== 0) {
    next();
    return;
  }

  cspMiddleware(req, res, () => {
    req.shouldBeSecure = true;
    req.url = req.url.replace('/secure', '');
    res.locals = { ...res.locals, nonce: req.nonce };
    res.set('X-Frame-Options', 'DENY');
    next();
  });
});

app.all('/', (req, res, next) => {
  res.redirect('/login');
});

app.use('/login', require('./login'));
app.use('/register', require('./register'));
app.use('/home', verifyLogin, require('./home'));
app.use('/post', require('./post'));
app.use('/csp-report', require('./csp-report'));

init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(err);
  });
