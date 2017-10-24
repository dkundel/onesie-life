const router = require('express').Router();
const bodyParser = require('body-parser');
const path = require('path');
const { returnView } = require('../shared/utils');
const { generateToken } = require('../shared/jwt');
const { authenticateUser } = require('../shared/db');

const parsePost = bodyParser.urlencoded({ extended: false });

router.get('/', returnView(path.join(__dirname, '/login.marko')));

router.post('/', parsePost, async (req, res) => {
  const { username, password } = req.body;
  try {
    const userData = await authenticateUser(username, password);
    if (userData === null) {
      res.status(403);
      res.marko(require('./login.marko'));
      return;
    }

    const token = generateToken(userData);
    res.cookie('authToken', token);
    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to log in');
  }
});

module.exports = router;
