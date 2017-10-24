const router = require('express').Router();
const parsePost = require('body-parser').urlencoded({ extended: false });

const { createPost, getPosts } = require('../shared/db');
const { verifyLogin } = require('../shared/jwt');

router.post('/', verifyLogin, parsePost, async (req, res) => {
  const { message: rawMessage } = req.body;
  if (!rawMessage) {
    res.status(400).send('No message :(');
    return;
  }

  try {
    const data = await createPost(req.user.name, rawMessage);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save!');
  }
});

router.get('/', async (req, res) => {
  const { callback } = req.query;

  const data = await getPosts();
  const responseData = `${callback}(${JSON.stringify({ data })})`;
  res.type('application/javascript').send(responseData);
});

module.exports = router;
