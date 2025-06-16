var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv=require("dotenv")
const session=require("express-session")
const passport=require("./config/passport")
var indexRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

const env=require('dotenv').config()

const db=require('./config/db')
db()

// view engine setup
app.set('views', [path.join(__dirname, 'views'),path.join(__dirname, 'views/user'),path.join(__dirname, 'views/admin'),path.join(__dirname, 'views/partials')]);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge:72*1000*60*60, 
      secure: false,
      httpOnly:true
  }
}));
app.use(passport.initialize())
app.use(passport.session())
app.use((req,res,next)=>{
  res.set('cache-control','no-store')
  next()
})
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

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
