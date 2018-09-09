var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport =  require('passport');
var jwt = require('jsonwebtoken');


var app = express();

app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view cache',false);

app.set('databases',{});

//Session settings
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',resave: true,
    saveUninitialized: true })); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));

// Preflight response
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "token, userId, X-Requested-With, content-type, Cache-Control");
    res.setHeader("Access-Control-Allow-Credentials", true);

    if(req.method != 'OPTIONS'){
        next()
    }else{
        res.send(200)
    }
});


//Passport Auth
require("./middleware/Passport.js")(passport,app)
app.set('passport',passport)

//Api routes
app.use('/api',require("./api")(app));
//Login and Logout routes
//require('./routes/auth')(null,app,null)

// Empoloyee Routes
var routes = require('./routes')(express,app);

// Customer Routes



// app.use('/noToken', routes.noToken);

app.use(require("./middleware/authentication"));
app.use('/', routes.dashboard);
app.use('/movies', routes.movie);
app.use('/customers', routes.customer);
app.use('/employees', routes.employee);
app.use('/purchases', routes.purchase);
app.use('/rentals', routes.rental);


// app.use('/', routes.activity);
// app.use('/stores', routes.stores);
// app.use('/comment', routes.comment);
// app.use('/organizations', routes.organizations);
// app.use('/stripe', routes.stripe);
// app.use('/tickets', routes.tickets);
// app.use('/tasks', routes.tasks);
// app.use('/invoice', routes.invoice);
// app.use('/contacts', routes.contacts);
app.use('/', routes.activity);
// app.use('/leads', routes.leads);
// app.use('/users', routes.users);
// app.use('/adImage', routes.clickImage);
// app.use('/qaLog', routes.qaLog);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log(err);
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/


module.exports = app;
