var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
//initialize mongoose schemas
require('./models/models');
var index = require('./routes/index');
var api = require('./routes/api');
var upload = require('./routes/upload');
var authenticate = require('./routes/authenticate')(passport);
var mongoose = require('mongoose'); //add for Mongo support
mongoose.connect('mongodb://localhost/test-chirp'); //connect to Mongo
var app = express();

var api_key = '4a94b9ddc7e28006170e29b9e7ab5a0b-8889127d-d9d89be0';
var domain = 'sandboxdc705a9195684b13948ef2946002cf14.mailgun.org';
var mailgun = require('mailgun-js')(
{
    apiKey: api_key,
    domain: domain
});

//App request to send a message to max, will later make a call more like:
/**
 * app.get('/submit/:mail', function(req,res) {

    var data = {
      from: le boggey man oui oui,
      to: req.params.mail ((The money shot, see above req call :mail))
 */
//Also remember to use the routes folder
app.get('/mailgun', function(req, res, next)
{

    var data = {
        from: 'Employment <maxfrancis212@gmail.com>',
        to: 'maxfrancis212@gmail.com',
        subject: 'Rejected',
        text: 'You smell like Camembert go away!, Deloitte Recruiting'
    };

    mailgun.messages().send(data, function(error, body) {});

    res.send(
    {
        state: 'success'
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(session(
{
    secret: 'keyboard cat'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
{
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/auth', authenticate);
app.use('/api', api);
app.use('/upload', upload);

// catch 404 and forward to error handler
app.use(function(req, res, next)
{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development')
{
    app.use(function(err, req, res, next)
    {
        res.status(err.status || 500);
        res.render('error',
        {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next)
{
    res.status(err.status || 500);
    res.render('error',
    {
        message: err.message,
        error:
        {}
    });
});


module.exports = app;