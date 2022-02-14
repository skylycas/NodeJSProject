var express = require('express');
const session = require('express-session');
var router = express.Router();

var dbclient = require("mongodb").MongoClient;
var connectionstring = ("mongodb+srv://skylycas:Godwithus1@cluster0.3bzj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

var sessionvariable;

/* GET home page. */
router.get('/', function(req, res, next) {

  sessionvariable = req.session;

  dbclient.connect(connectionstring, function(errmsg, dbdata)
  {
    if(errmsg)
    {
        throw errmsg;
    }
    else
    {
      var database = dbdata.db("NodeJSProjectDB");
      database.collection("tblrooms").find({}).toArray(function(err, response){
        if (err)
        {
            throw err;
        }
        else
        {
          //pass the response to the index page
          if(sessionvariable.firstname)
          {
            res.render('index', 
            {
              username: '[ User: ' + sessionvariable.firstname + ' ]',
              login_logout_text: sessionvariable.login_logout_text,
              login_logout_link: sessionvariable.login_logout_link,
              signup_text: sessionvariable.signup_text,
              signup_link: sessionvariable.signup_link, rooms: response});
          }
          else
          {
            sessionvariable.login_logout_text = 'Login';
            sessionvariable.login_logout_link = 'login';
            sessionvariable.signup_text = 'Sign Up';
            sessionvariable.signup_link = 'signup';
        
            res.render('index', 
            {
              username: '', 
              login_logout_text: sessionvariable.login_logout_text,
              login_logout_link: sessionvariable.login_logout_link,
              signup_text: sessionvariable.signup_text,
              signup_link: sessionvariable.signup_link, rooms: response});
          }

        }
      });
    }
  });  
});


router.post('/', function(req, res, next) {
  sessionvariable = req.session;

  sessionvariable.roomid = req.body.roomid; //keep the room user selected in session even if user is not logged in yet
  sessionvariable.roomtitle = req.body.roomtitle;
  sessionvariable.imagename = req.body.imagename;
  sessionvariable.price = req.body.price;

  if(sessionvariable.emailaddress)
  {
    res.redirect('bookroom');
  }
  else
  {
    res.redirect('login');
  }
});

module.exports = router;
