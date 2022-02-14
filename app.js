var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
 
//I added this myself
var session = require('express-session');
var nocache = require('nocache');
//const nocache = require('nocache');

var indexRouter = require('./routes/');
var loginRouter = require('./routes/login');
var bookroomRouter = require('./routes/bookroom');
var signuproomRouter = require('./routes/signup');
var successRouter = require('./routes/success');
var logoutRouter = require('./routes/logout');
var adminRouter = require('./routes/admin');
var viewallRouter = require('./routes/viewall');
var addroomRouter = require('./routes/addroom');
var bookreceiptRouter = require('./routes/bookreceipt');
var mybookingsRouter = require('./routes/mybookings');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//I added this myself
app.use(nocache()); // this prevents back button to the previous page after logout
//app.use(session({secret: 'yudo'})); //I added this myself
app.use(session({secret: 'yudo', resave: true, saveUninitialized: true})); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));
// app.use(express.static('files'));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/bookroom', bookroomRouter);
app.use('/signup', signuproomRouter);
app.use('/success', successRouter);
app.use('/logout', logoutRouter);
app.use('/admin', adminRouter);
app.use('/viewall', viewallRouter);
app.use('/addroom', addroomRouter);
app.use('/bookreceipt', bookreceiptRouter);
app.use('/mybookings', mybookingsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
