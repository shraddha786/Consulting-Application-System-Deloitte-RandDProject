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

var api_key = 'c55cd8888b182d32dfed3d3c619db567-0e6e8cad-b0106ba8';
var domain = 'sandbox9cd11e85a9b84a29b66264cba0192425.mailgun.org';
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
        from: 'Deloitte Recruiting',
        to: 'maxfrancis212@gmail.com',
        subject: 'Stage 2',
        text: 'Thank you applying! please continue progressing through the next few directed stages to be considered for a position'
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

//Also remember to use the routes folder
//Sends the rejection email to the applicant
app.get('/rejection', function(req, res, next)
{

    var data = {
        from: 'Deloitte Recruiting',
        to: 'maxfrancis212@gmail.com',
        subject: 'Graduate / Internship Information',
        text: 'Dear Applicant_FirstName,'+

        'Thank you for your application to the Deloitte 2018/2019 Consulting Graduate/Intern Programme.'+
        
        'We appreciate your interest in Deloitte and congratulate you on your achievements to date.'+ 
        
        'Unfortunately, we will not be progressing any further with your application. The selection process was highly competitive, and we have decided to move forward with candidates whose qualifications better meet our needs at this time.'+
        
        'We would like to thank you for the time and effort you have put into your application.'+
        
        'Please note that due to many applications we will not be able to provide specific feedback on your application.'+
        
        'We wish you good luck with your job search and professional future endeavours.'+
        
        'Kind Regards,'+
        'Deloitte Recruitment Team'
    };

    mailgun.messages().send(data, function(error, body) {});

    res.send(
    {
        state: 'success'
    });
});


//This approve stage mail is sent to applicant when he/she passes the CV screening stage & is invited for video interview'
/*
app.get('/approve', function(req, res, next)
{

    var data = {
        from: 'Deloitte Recruiting',
        to: 'maxfrancis212@gmail.com',
        subject: 'Graduate / Internship Information',
        text: 'Dear Applicant_FirstName,'+
            
            'Thank you for your interest in the Deloitte NZ Graduate Programme that we are currently advertising.'+ 
            
            'We have received your application and now invite you to complete a short one-way video interview. Your video link is valid for 2 days from receiving this email; please ensure you complete the video interview as soon as possible.'+ 
            
            'The video interview is hosted on an external website (www.deloittevideointerview.com) and can be accessed from your desktop/laptop or mobile smart device. You will need to have a webcam or camera phone and a microphone. After you have created a profile and logged in you will be able to try a practice question to test your microphone and camera quality. Once you are satisfied with the quality you will then commence the video interview.'+ 
            'There are several questions for you to answer. Each question will appear one at a time on screen; you will have 30 seconds to read the question and then you will have a pre-set amount of time (30 or 60 seconds) to answer each question.'+ 
            
            'Please follow this link in order to complete your video interview: '+
            'https://actual-link.com//'+
            
            'If you experience any technical difficulties, please email support@deloitteNZRecruiting.com with your issue. They will endeavour to get back to you within 24 hours to resolve your issue.'+ 
            
            'We will be reviewing applications over the next few weeks and will notify you of the status of your application no later than 2 weeks from completion. If you are shortlisted, you will be invited to the first round of interviews.'+
            'Thank you again, and best of luck with your application.'+
            
            'Kind Regards,'+
            'Deloitte Recruitment Team'
        
    };

    mailgun.messages().send(data, function(error, body) {});

    res.send(
    {
        state: 'success'
    });
});*/



module.exports = app;