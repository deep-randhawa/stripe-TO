
/**
 * GET /
 */
exports.getHome = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};