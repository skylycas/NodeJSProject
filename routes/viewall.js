var express = require('express');
const session = require('express-session');
var router = express.Router();

var dbclient = require("mongodb").MongoClient;
var connectionstring = ("mongodb+srv://skylycas:Godwithus1@cluster0.3bzj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
var sessionvariable;

/* GET home page. */
router.get('/', function(req, res, next) {

    sessionvariable = req.session;
    

    if(sessionvariable.firstname)
    {
        dbclient.connect(connectionstring, function(errmsg, dbdata)
        {
          if(errmsg)
          {
              throw errmsg;
          }
          else
          {
              var listofbookedroom="";
              var database = dbdata.db("NodeJSProjectDB");
              database.collection("tblrooms").find({}).toArray(function(err, response){
                  if (err)
                  {
                      throw err;
                  }
                  else
                  {
                      if(response)
                      {
                        sessionvariable.listofroom = response;
                      }
                      else
                      {
                        listofroom = "You have not booked a room, click on the rooms link to book a room.";
                      }
                    res.render('viewall', 
                    {
                      username: '[ User: ' + sessionvariable.firstname + ' ]',
                      login_logout_text: sessionvariable.login_logout_text,
                      login_logout_link: sessionvariable.login_logout_link,
                      signup_text: sessionvariable.signup_text,
                      signup_link: sessionvariable.signup_link, listofrooms: sessionvariable.listofroom});
                  }
              });
          }
        });
    }
    else
    {
      res.redirect('logout');
    }
    
});

router.post('/', function(req, res, next) {

    console.log(req.body.bookedroom);

    res.render('viewall', 
    {
      username: '[ User: ' + sessionvariable.firstname + ' ]',
      login_logout_text: sessionvariable.login_logout_text,
      login_logout_link: sessionvariable.login_logout_link,
      signup_text: sessionvariable.signup_text,
      signup_link: sessionvariable.signup_link, bookedrooms: sessionvariable.listofroom});
    
    // res.render('mybookings');
});
module.exports = router;