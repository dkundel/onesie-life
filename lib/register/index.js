const router = require('express').Router();
const { createUser } = require('../shared/db');

const parsePost = require('body-parser').urlencoded({ extended: false });

router.post('/', parsePost, async (req, res) => {
  const { username, password } = req.body;

  try {
    const data = createUser(username, password, 'user');
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to register');
  }
});

module.exports = router;
