const router = require('express').Router();
const parsePost = require('body-parser').urlencoded({ extended: false });

const { createPost } = require('../shared/db');

router.post('/', parsePost, async (req, res) => {
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

module.exports = router;
