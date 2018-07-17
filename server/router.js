var express = require('express');
var router = express.Router();

module.exports = function (passport) {

  /* GET home page. */
  // router.get('/', passport.authenticate('local'), function(req, res, next) {
  router.get('/', function (req, res, next) {
    console.log('router.js req.isAuthenticated', req.isAuthenticated());
    if (!req.isAuthenticated()) {
      res.redirect('/login');
    }
    res.json({"status": 200});
  });
  return router;
};
