require('marko/node-require');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const express = require('express');
const path = require('path');
const markoExpress = require('marko/express');

const { verifyLogin } = require('./shared/jwt');
const { init } = require('./shared/db');

const app = express();
const PORT = process.env.PORT || 3000;

const parsePost = bodyParser.urlencoded({ extended: false });

app.use(
  express.static(path.join(__dirname, '../public'), {
    index: false,
    extensions: ['html']
  })
);
app.use(markoExpress());
app.use(cookieParser());

app.all('/', (req, res, next) => {
  res.redirect('/login');
});

app.use('/login', require('./login'));
app.use('/register', require('./register'));
app.use('/home', verifyLogin, require('./home'));
app.use('/post', verifyLogin, require('./post'));

init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(err);
  });
