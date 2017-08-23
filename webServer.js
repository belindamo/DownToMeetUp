var mongoose = require('mongoose');
var async = require('async');


// FIX - Load the Mongoose schema for MeetUp and SchemaInfo
var MeetUp = require('./schema/meetUp.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

// FIX - app that mongodb is connecting to. need to create db
//mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/components', express.static(__dirname + '/components'));

// session stuff
var session = require('express-session');
var bodyParser = require('body-parser');
//var fs = require('fs'); //at the top
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');


app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

// -------------

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// -------------

/*
 * Start up the web server.
 */
app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});


/* 
 * Create the meetUp, from the homepage
 * sim to app.post('/user')
 * request body should contain name and date range.
 * make a new calendar with initialized. Calendar.create
 * initialize with: name, empty calendars array, date range,
 * full calendar empty.
 */
app.post('/meetUp', function(request, response) {
  var meet = request.body;
  console.log(meet);
  MeetUp.create({name: meet.name, date_start: meet.startDate, date_end: meet.endDate, time_start: meet.startTime, time_end: meet.endTime, main_calendar: {}, user_calendars: []}, function(err, newMeetUp) {
                  console.log("meetup create")
                  if (err) {
                    console.log("Error when creating meetUp");
                    response.status(500).send(JSON.stringify(err));
                    return;
                  } else {
                    //newMeetUp.id = newMeetUp._id; not necessary
                    console.log('Created MeetUp with ID ', newMeetUp._id);
                    newMeetUp.save({}, function() {
                      response.end(JSON.stringify(newMeetUp));
                    });
                  }
                });
});

app.route('/meetUp/:id')
//get's the meetup based on its id. browser side gets id through the url.
  .get(function(request, response) { //retrieve meetUp
    console.log(request.params.id);

    var id = request.params.id;
    MeetUp.findOne({_id: id}, function(err, meet) {
      if (err || meet === null) {
        response.status(401).send(err);
        return;
      }
      meet = JSON.parse(JSON.stringify(meet)); //make sure it's sent in correct format
      response.send(JSON.stringify(meet));
    });
  });
  //update meetUp cal or other meetUp schema info (like name) besides userCals
  //but tbh, how much do we want to let them edit after creating the meetup?
  // if we want more functionality, we can pass in an object with key that
  //indicates what we would like to edit
/*
  .post(function(request,response) {  //put or post?
    console.log(request.params.id);
    var id = request.params.id;
    var toChange = request.body.change; 

    MeetUp.findOne({_id: id}, function(err, meet) {
      if (err || meet === null) {
        response.status(401).send(err);
        return;
      }



    });
  }) 
*/
  //Is this necessary? Do we want to provide this functionality?
  /* 
  .delete(function(request, response) { //delete meetUp

  }) //need semicolon?
*/


/*
 * POST
 * Called upon creating a new user calendar
 * request body should contain name of user, opt password,
 * and opt google cal data? <- storage org tbd
 * ^should be parsed on browser side, send
 * what is necessary through body to store.
 */
app.post('/userCalendar', function(request, response) {
  //request should contain meetup id, and necessary user info
  //MeetUp.findOne for correct meetup
  //cal.username = etc etc
  //then, update meetup with another calendar. 
  var id = request.body.meet_id;
  //what other stuff do we need to pass into the body and store?
  var username = request.body.username;

  if (username === null) {
    response.status(400).send("Empty username");
    return;
  }

  MeetUp.findOne({_id: id}, function(err, meet) {
    if (err || meet === null) {
      response.status(401).send(err);
      return;
    }

    var c = {}; //new user_calendar
    c.username = username;
    meet.user_calendars.push(c);

    meet.save({}, function() {
      return response.status(200).end();
    }, function errorHandling(err) {
      response.status(500).send(JSON.stringify(err));
    });

  });

});

/*
 * Gets the main calendar
 */
 /* unnceesary bc this is passed in entire meetup app.get(/meetup/:id)
 app.get('/mainCal/:meet_id', function(request, response) {
  var id = request.params.meet_id;
  MeetUp.findOne({_id: id}, function(err, meet) {
    if (err || meet === null) {
      response.status(401).send(err);
      return;
    }

    var c = JSON.parse(JSON.stringify(meet.main_calendar));

    response.send(JSON.stringify(c));

  });
 });
*/

app.route('/userCalendar/:id')
/* This is unnecessary atm
  .get(function(request, response) { //retrieve user's cal

  })
*/
/* what are we posting?*/
  .post(function(request,response) { //update user's cal. FIX - not sure if this should be put vs post? tbd
    response.status(400).send("/userCalendar/:id has not yet been implemented");
  }); 
  /* tb implemented later
  .delete(function(request, response) { //delete user's cal

  }) //need semicolon?


*/
/*
 * Quick fix for hashbang issue
 */
app.get('*', function(req, res) {
  res.redirect('/#!' + req.originalUrl);
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    // var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});





