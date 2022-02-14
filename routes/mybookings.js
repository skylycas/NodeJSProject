const { ObjectId } = require('bson');
var express = require('express');
const session = require('express-session');
var router = express.Router();

var dbclient = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectId;
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
            database.collection("tblbookedrooms").find({}).toArray(function(err, response){
                if (err)
                {
                    throw err;
                }
                else
                {
                    if(response)
                    {
                      sessionvariable.listofbookedroom = response;
                    }
                    else
                    {
                      listofbookedroom = "You have not booked a room, click on the rooms link to book a room.";
                    }
                  res.render('mybookings', 
                  {
                    username: '[ User: ' + sessionvariable.firstname + ' ]',
                    login_logout_text: sessionvariable.login_logout_text,
                    login_logout_link: sessionvariable.login_logout_link,
                    signup_text: sessionvariable.signup_text,
                    signup_link: sessionvariable.signup_link, bookedrooms: sessionvariable.listofbookedroom});
                }
            });
        }
      });
  }
  else
  {
    res.redirect('logout');
  }
    
    // res.render('mybookings');
});


router.post('/', function(req, res, next) {

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
         

            var database = dbdata.db("NodeJSProjectDB");
            database.collection("tblbookedrooms").findOne({_id: new ObjectID(req.body.bookedroomid)}, function(err, response){
                if (err)
                {
                    throw err;
                }
                else
                {
                  var singleroomArray = [];
                  singleroomArray.push(response);
                  sessionvariable.bookedroomObj  = singleroomArray;
                  res.redirect('bookreceipt');
                }
            });
        }
      });

      // console.log(req.body.bookedroomid);
  }
  else
  {
    res.redirect('logout');
  }
  
});

module.exports = router;