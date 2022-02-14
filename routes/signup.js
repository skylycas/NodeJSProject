var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var dbclient = require("mongodb").MongoClient;
var connectionstring = ("mongodb+srv://skylycas:Godwithus1@cluster0.3bzj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
var sessionvariable;

/* GET home page. */
router.get('/', function(req, res, next)
{
    sessionvariable = req.session;

    if(sessionvariable.firstname)
    {
      res.render('signup', 
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
  
      res.render('signup', 
      {
        username: '', 
        login_logout_text: sessionvariable.login_logout_text,
        login_logout_link: sessionvariable.login_logout_link,
        signup_text: sessionvariable.signup_text,
        signup_link: sessionvariable.signup_link
      });
    }

    // res.render('signup');
});


var mailtransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'yudotestmail@gmail.com',
      pass: 'Godwithus1'
  },
});


router.post('/', function(req, res, next)
{
    sessionvariable = req.session;

    sessionvariable.firstname = req.body.firstname;
    sessionvariable.lastname = req.body.lastname;
    sessionvariable.idtype = req.body.IdType;
    sessionvariable.idnumber = req.body.idnumber;
    sessionvariable.emailaddress = req.body.emailaddress;
    var password = req.body.password;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    sessionvariable.country = req.body.country;
    sessionvariable.state = req.body.state;
    sessionvariable.zip_postal = req.body.zip_postal;


    dbclient.connect(connectionstring, function(errmsg, dbdata)
    {
        if (errmsg)
        {
            throw errmsg;
        }
        else
        {
            var database = dbdata.db("NodeJSProjectDB");
            var query = { email: sessionvariable.email};
        database.collection("tbluser").findOne(query, function(errOffind, responseOffind){
            //if user alreday exists
            if (responseOffind)
            {
                req.session.destroy();

                res.render('signup', { message: "This user already has an account, click the link below, to login"});
            }
            else
            {
              var userobj = [];

              userobj.push({
              firstname: sessionvariable.firstname,
              lastname: sessionvariable.lastname,
              idtype: sessionvariable.idtype,
              idnumber: sessionvariable.idnumber,
              address1: address1,
              address2: address2,
              country: sessionvariable.country,
              emailaddress: sessionvariable.emailaddress,
              state: sessionvariable.state,
              zip_postal: sessionvariable.zip_postal,
              emailaddress: sessionvariable.emailaddress,
              password: password});

                database.collection("tbluser").insertMany(userobj, function(err, response){
                    if (err)
                    {
                        throw err;
                    }
                    else
                    {
                        // console.log(response.insertedCount + " user(s) added sucessfully!!");



                        //send email
                    var mailOptions = {
                    from: 'yudotestmail@gmail.com',
                    to: sessionvariable.emailaddress,
                    subject: 'Registration Successful - StelChi',
                    text: sessionvariable.firstname + ' '+ sessionvariable.lastname + ', welcome to StelChi: '
                    };

                    mailtransporter.sendMail(mailOptions, function(err, response)
                    {
                        if (err)
                        {
                            console.log(err);

                            req.session.destroy();
                            req.app.set('errormsg', "Email could not be sent. " + err.message);
                            req.app.set('message', "Registartion Successful!, an email has been sent to "+ sessionvariable.emailaddress);

                            res.redirect('success');
                        }
                        else
                        {
                          console.log('Email sent');

                          req.app.set('errormsg', "");
                          req.app.set('message', "Registartion Successful!, an email has been sent to "+ sessionvariable.emailaddress);
                          res.redirect('success');
                        }
                    });                    
                }
                // dbdata.close();
            });
          }

      });
    }
});




  // res.render('signup');
});

module.exports = router;