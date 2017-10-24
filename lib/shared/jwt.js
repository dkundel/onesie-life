const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'myextremelysecretsecret';

function generateToken(userData) {
  return jwt.sign(userData, SECRET);
}

function verifyLogin(req, res, next) {
  if (!req.cookies || !req.cookies.authToken) {
    res.status(403).send('You shall not pass!');
    return;
  }

  const { authToken } = req.cookies;
  jwt.verify(authToken, SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      res.status(403).send('You shall not pass!!');
      return;
    }
    req.user = {
      name: payload.username,
      role: payload.role
    };
    next();
  });
}

module.exports = { generateToken, verifyLogin };
