var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var dbclient = require("mongodb").MongoClient;
var connectionstring = ("mongodb+srv://skylycas:Godwithus1@cluster0.3bzj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
var sessionvariable;


/* GET home page. */
router.get('/', function(req, res, next) {

  sessionvariable = req.session;
  if(sessionvariable.emailaddress)
    {
        // res.render('bookroom');

        // sessionvariable.roomid = req.body.roomid; //keep the room user selected in session even if user is not logged in yet
        // sessionvariable.roomtitle = req.body.roomtitle;
        // sessionvariable.imagename = req.body.imagename;
        // sessionvariable.price = req.body.price;

         var roomid= sessionvariable.roomid;
         var roomtitle= sessionvariable.roomtitle;
         var imagename= sessionvariable.imagename;
         var price= sessionvariable.price;

         var firstname = sessionvariable.firstname;
         var lastname = sessionvariable.lastname;

        // console.log(roominfo);
        if(sessionvariable.firstname)
        {
          res.render('bookroom', 
          {
            username: '[ User: ' + sessionvariable.firstname + ' ]',
            login_logout_text: sessionvariable.login_logout_text,
            login_logout_link: sessionvariable.login_logout_link,
            signup_text: sessionvariable.signup_text,
            signup_link: sessionvariable.signup_link,
            roomid: roomid,
            roomtitle: roomtitle,
            imagename: imagename,
            price: price,
            firstname: firstname,
            lastname: lastname
          });
        }
        else
        {
          res.redirect('logout');
        }
    }
    else
    {
      res.redirect('logout');
    }
});


var mailtransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'yudotestmail@gmail.com',
      pass: 'Godwithus1'
  },
});


router.post('/', function(req, res, next) {

  sessionvariable = req.session;

  sessionvariable.datefrom = req.body.datefrom;
  sessionvariable.dateto = req.body.dateto;
  sessionvariable.noOfDays = req.body.noOfDays;
  sessionvariable.subtotal = req.body.subtotal;
  sessionvariable.tax = req.body.tax;
  sessionvariable.total = req.body.total;

  if(sessionvariable.emailaddress)
  {
    dbclient.connect(connectionstring, function(errmsg, dbdata)
    {
      if (errmsg)
      {
          throw errmsg;
      }
      else
      {
          var database = dbdata.db("NodeJSProjectDB");
          var bookedroomObj = [];

          bookedroomObj.push({
              emailaddress: sessionvariable.emailaddress,
              roomid: sessionvariable.roomid,
              roomtitle:sessionvariable.roomtitle,
              datefrom: sessionvariable.datefrom,
              dateto: sessionvariable.dateto,
              price: sessionvariable.price,
              noofdays: sessionvariable.noOfDays,              
              subtotal: sessionvariable.subtotal,
              tax: sessionvariable.tax,
              total: sessionvariable.total});

              database.collection("tblbookedrooms").insertMany(bookedroomObj, function(err, response){
                if (err)
                {
                    throw err;
                }
                else
                {
                  //store the booked information in a session
                  sessionvariable.bookedroomObj  = bookedroomObj;
                                          //send email
                    var mailOptions = {
                    from: 'yudotestmail@gmail.com',
                    to: sessionvariable.emailaddress,
                    subject: 'StelChi Booking Receipt - ' + sessionvariable.roomtitle,
                    text: 'Room: ' + sessionvariable.roomtitle + '\n Name: ' + sessionvariable.firstname + ' ' + sessionvariable.lastname + '\n Period: ' +  sessionvariable.datefrom + ' to ' + sessionvariable.datefrom + '(' + sessionvariable.noOfDays + ' day(s))' + '\n Rate: $' + sessionvariable.price + '\n Sub-Total: $' + sessionvariable.subtotal + '\n Tax: $' + sessionvariable.tax + '\n Total: $' + sessionvariable.total
                    };

                    mailtransporter.sendMail(mailOptions, function(err, response)
                    {
                        if (err)
                        {
                            console.log(err);                            
                            req.app.set('errormsg', "Email could not be sent. " + err.message);
                            req.app.set('message', "Booking Successful!, an email has been sent to "+ sessionvariable.emailaddress);

                            res.redirect('bookreceipt');
                        }
                        else
                        {
                          console.log('Email sent');

                          req.app.set('errormsg', "");
                          req.app.set('message', "Booking Successful!, an email has been sent to "+ sessionvariable.emailaddress);
                          res.redirect('bookreceipt');
                        }
                    });
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
module.exports = router;
