require('dotenv').config('./.env')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recepieRouter = require('./routes/recepie')
const exploreRouter = require('./routes/explore')
const user = require('./models/userSchema')
const passport = require('passport')
const session = require('express-session')

var app = express();
const db = require('./models/connect')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  saveUninitialized:true,
  resave:true,
  secret:"asdf"
  // secret:process.env.SESSION_SECRET
}))

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recepie',recepieRouter)
app.use('/explore',exploreRouter)

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
