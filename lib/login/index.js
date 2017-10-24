const router = require('express').Router();
const bodyParser = require('body-parser');
const { returnView } = require('../shared/utils');
const { generateToken } = require('../shared/jwt');
const { authenticateUser } = require('../shared/db');

const parsePost = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
  const tmpl = require('./login.marko');
  const queryParam = req.shouldBeSecure ? 'secure' : '';
  res.marko(tmpl, { queryParam });
});

router.post('/', parsePost, async (req, res) => {
  const httpOnly = req.query.secure !== undefined;
  const { username, password } = req.body;
  try {
    const userData = await authenticateUser(username, password);
    if (userData === null) {
      res.status(403);
      res.marko(require('./login.marko'));
      return;
    }

    const token = generateToken(userData);
    res.cookie('authToken', token, { httpOnly });
    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to log in');
  }
});

module.exports = router;
