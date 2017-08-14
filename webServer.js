var mongoose = require('mongoose');
var async = require('async');


// FIX - Load the Mongoose schema for User, Photo, and SchemaInfo
var MeetUp = require('./schema/meetUp.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

// FIX - app that mongodb is connecting to. need to create db
//mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

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
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    //console.log('/test called with param1 = ', request.params.p1);
    console.log("reached /test/:p1")
    var param = request.params.p1 || 'info';
                console.log("1");

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        console.log("2")
        SchemaInfo.find({}, function (err, info) {
            console.log("3");
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            //console.log('SchemaInfo', info[0]);
            response.send(JSON.stringify(info[0]));
        });
        
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        // FIX - not same schemas
        /*
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.send(JSON.stringify(obj));

            }
        });*/
        response.status(400).send("need to create schema");
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }

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
  var cal = request.body;
  console.log(cal);
  MeetUp.create({name: cal.name, date_start: cal.startDate, date_end: cal.endDate, time_start: cal.startTime, time_end: cal.endTime}, function(err, newMeetUp) {
                  console.log("meetup create")
                  if (err) {
                    console.log("Error when creating meetUp");
                    response.status(500).send(JSON.stringify(err));
                    return;
                  } else {
                    newMeetUp.id = newMeetUp._id;
                    console.log('Created MeetUp with ID ', newMeetUp.id);
                    newMeetUp.save({}, function() {
                      response.end(JSON.stringify(newMeetUp));
                    });
                  }
                });
});

app.route('/meetUp/:id')
  .get(function(request, response) { //retrieve user's cal
    console.log(request.params.id);
  })
  //update meetUp cal or other meetUp schema info (like name) besides userCals
  // FIX - not sure if this should be put vs post? tbd
  .put(function(request,response) { 

  }) 
  .delete(function(request, response) { //delete meetUp

  }) //need semicolon?


/*
 * POST
 * Called upon creating a new user calendar
 * request body should contain name of user, opt password,
 * and opt google cal data? <- storage org tbd
 * ^should be parsed on browser side, send
 * what is necessary through body to store.
 */
app.post('/userCalendar', function(request, response) {

});

app.route('/userCalendar/:id')
  .get(function(request, response) { //retrieve user's cal

  })
  .put(function(request,response) { //update user's cal. FIX - not sure if this should be put vs post? tbd

  }) 
  .delete(function(request, response) { //delete user's cal

  }) //need semicolon?

/*
 * If they give us a link we don't recognize, redirect to home
 */
app.get('*', function(req, res) {
  res.redirect('/#!' + req.originalUrl);
});

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});





