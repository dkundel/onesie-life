function returnView(tmplPath) {
  return (req, res) => {
    const tmpl = require(tmplPath);
    res.marko(tmpl);
  };
}

module.exports = { returnView };
