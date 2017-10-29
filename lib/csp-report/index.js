const router = require('express').Router();
const { json: jsonParser } = require('body-parser');

function rewriteContentType(req, res, next) {
  if (req.get('Content-Type') === 'application/csp-report') {
    req.headers['content-type'] = 'application/json';
    next();
  }
  res.status(400).send();
}

router.post('/', rewriteContentType, jsonParser(), (req, res) => {
  console.warn('CSP Violation');
  console.log(req.body);
  res.send();
});

module.exports = router;
