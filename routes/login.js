var express = require('express');
var router = express.Router();

var dbclient = require("mongodb").MongoClient;
var connectionstring = ("mongodb+srv://skylycas:Godwithus1@cluster0.3bzj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
var sessionvariable;

/* GET home page. */
router.get('/', function(req, res, next) {

  sessionvariable = req.session;

  if(sessionvariable.firstname)
  {
    res.render('login', 
    {
      username: '[ User: ' + sessionvariable.firstname + ' ]',
      login_logout_text: sessionvariable.login_logout_text,
      login_logout_link: sessionvariable.login_logout_link,
      signup_text: sessionvariable.signup_text,
      signup_link: sessionvariable.signup_link
    });
  }
  else
  {
    sessionvariable.login_logout_text = 'Login';
    sessionvariable.login_logout_link = 'login';
    sessionvariable.signup_text = 'Sign Up';
    sessionvariable.signup_link = 'signup';

    res.render('login', 
    {
      username: '', 
      login_logout_text: sessionvariable.login_logout_text,
      login_logout_link: sessionvariable.login_logout_link,
      signup_text: sessionvariable.signup_text,
      signup_link: sessionvariable.signup_link
    });
  }

  // res.render('login');
});



router.post('/', function(req, res, next) {

  sessionvariable = req.session;


  sessionvariable.emailaddress = req.body.emailaddress;
  var password = req.body.password;

  dbclient.connect(connectionstring, function(errmsg, dbdata)
  {
    if(errmsg)
    {
        throw errmsg;
    }
    else
    {
        var database = dbdata.db("NodeJSProjectDB");
        var query = {$and: [{emailaddress: sessionvariable.emailaddress}, {password: password}]};
       database.collection("tbluser").findOne(query, function(err, response){
            if (err)
            {
                throw err;
            }
            else
            {
                if (response)
                {
                  sessionvariable.firstname = response.firstname;
                  sessionvariable.lastname = response.lastname;


                  sessionvariable.login_logout_text = 'Logout';
                  sessionvariable.login_logout_link = 'logout';
                  sessionvariable.signup_text = 'My Bookings';
                  sessionvariable.signup_link = 'mybookings';

                  if(sessionvariable.roomid) //check If user already selected a rooom before being directed to login
                  {
                    res.redirect('bookroom');
                  }
                  else
                  {
                    res.redirect('/#rooms');
                  }
                }
                else
                {
                  req.session.destroy();
                  res.render('login', {message: 'Invalid email/password.'});
                }             
            }
            dbdata.close();
        });
    }
});

});


module.exports = router;
