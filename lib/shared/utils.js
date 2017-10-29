const csurf = require('csurf')({ cookie: true });

function returnView(tmplPath) {
  return (req, res) => {
    const tmpl = require(tmplPath);
    res.marko(tmpl);
  };
}

function csrfIfSecure(req, res, next) {
  if (!req.shouldBeSecure) {
    return next();
  }

  csurf(req, res, next);
}

module.exports = { returnView, csrfIfSecure };
