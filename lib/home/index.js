const router = require('express').Router();
const { getPosts } = require('../shared/db');

router.get('/', async (req, res) => {
  const tmpl = require('./home.marko');
  const posts = await getPosts();
  res.marko(tmpl, { ...req.user, posts });
});

module.exports = router;
