var express = require('express');
var router = express.Router();
const User = require('./../src/models').User;


let auth = passport => {

  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };


  router.post('/register', (req, res) => {
    if (!validateReq(req)) {
      res.json({ error: 'invalid registration'});
    } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      newUser.save(function(error){
        if (error){
          res.json({"error": error})
        }else{
          res.json({"status": 200});
        }
      })
    }
  });

  router.post('/login', passport.authenticate('local'), function(req, res) {

    // need to send back the documents
    res.redirect('/');
  });

  // GET Logout page
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });
};

module.exports = {
  auth: auth
}
