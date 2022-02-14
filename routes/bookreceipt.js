var express = require('express');
var router = express.Router();
var sessionvariable;

/* GET home page. */
router.get('/', function(req, res, next) {
  
    sessionvariable = req.session;
    var fullname = sessionvariable.firstname + ' ' + sessionvariable.lastname;

    // res.render('bookreceipt');
    var bookedroomObj = sessionvariable.bookedroomObj;
    if(sessionvariable.firstname)
    {
      res.render('bookreceipt', 
      {
        username: '[ User: ' + sessionvariable.firstname + ' ]',
        login_logout_text: sessionvariable.login_logout_text,
        login_logout_link: sessionvariable.login_logout_link,
        signup_text: sessionvariable.signup_text,
        signup_link: sessionvariable.signup_link, fullname: fullname, bookedroomObj: bookedroomObj[0]});
    }
    else
    {
      res.redirect('logout');
    }
    
});

router.post('/', function(req, res, next) {

});

module.exports = router;