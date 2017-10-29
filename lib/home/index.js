const router = require('express').Router();
const { getPosts } = require('../shared/db');
const { csrfIfSecure } = require('../shared/utils');

router.get('/', csrfIfSecure, async (req, res) => {
  const tmpl = require('./home.marko');
  const posts = await getPosts();
  res.marko(tmpl, { ...req.user, posts });
});

module.exports = router;
