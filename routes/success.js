var express = require('express');
var router = express.Router();
var sessionvariable;

/* GET home page. */
router.get('/', function(req, res, next) {

    var errormsg = req.app.get('errormsg');
    var message = req.app.get('message');
    res.render('success', {errormsg: errormsg, message: message});
    
});

router.post('/', function(req, res, next) {

    sessionvariable = req.session;
    if(sessionvariable.roomid) //check If user already selected a rooom before being directed to login
    {
        res.redirect('bookroom');
    }
    else
    {
        res.redirect('login');
    }   
});

module.exports = router;