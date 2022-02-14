var express = require('express');
var router = express.Router();
var util = require("util"); 
var fs = require("fs");
var formidable = require('formidable');
var path = require('path');
var newid = require('./idgenerator');


var nodemailer = require('nodemailer');
var dbclient = require("mongodb").MongoClient;
var connectionstring = ("mongodb+srv://skylycas:Godwithus1@cluster0.3bzj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
var sessionvariable;

/* GET home page. */
router.get('/', function(req, res, next) {

  sessionvariable = req.session;


  if(sessionvariable.logintype == 'administrator')
  {
    res.render('addroom', 
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
    req.session.destroy();
    res.redirect('admin');
  }
  
});

router.post('/', function(req, res, next) {

  var imagename = "";

  
  var form = new formidable.IncomingForm();  
  form.parse(req, function(errmsg, fields, files){

    if(errmsg)
    {
      console.log(errmsg + '---errormsg');
    }
    else
    {
      //upload image to server
      var roomtitle = fields.roomtitle;
      var roomdescription = fields.roomdescription;
      var price = fields.price;
      var oldPath = files.selectimg.filepath;
      imagename = newid.generateID().toString() + '__' + files.selectimg.originalFilename;
      var savetoPath = './public/images/rooms/' + imagename;
      // var savetoPath = 'C:/Users/YUDO/Desktop/send/' + files.selectimg.originalFilename;
       fs.rename(oldPath, savetoPath, function(err){
        // fs.writeFile(oldPath, savetoPath, function(err){
        if(err)
        {
          console.log(err);
        }
        else
        {
          // res.write(oldPath);
          // res.write(savetoPath);
          // res.end();

          dbclient.connect(connectionstring, function(errmsg, dbdata)
          {
            if (errmsg)
            {
                throw errmsg;
            }
            else
            {
              //insert the room information and image name into database
              var database = dbdata.db("NodeJSProjectDB");

              var insertobj = [];
              insertobj.push({
                roomtitle: roomtitle,
                roomdescription: roomdescription,
                imagename: imagename,
                price: price});

                database.collection("tblrooms").insertMany(insertobj, function(err, response){
                  if (err)
                  {
                     throw err;
                  }
                  else
                  {
                    res.render('addroom', 
                    {
                      username: '[ User: ' + sessionvariable.firstname + ' ]',
                      login_logout_text: sessionvariable.login_logout_text,
                      login_logout_link: sessionvariable.login_logout_link,
                      signup_text: sessionvariable.signup_text,
                      signup_link: sessionvariable.signup_link, message: 'Room Added successfully'
                    });
                  }
                });
            }
          });        
        }
      });
    }
  });

});

module.exports = router;