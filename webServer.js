// IMPORTANT 
// You can test out the webServer with fake data. 
// load database by running mongod, and entering in terminal "node loadMeetupDB.js"
// check out fake data in modelData/meetUpData to find ids of meetups to see how stuff looks

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
  var meet = request.body; //contains name, cal_start, cal_end, description, and slots
  console.log("webServer /meetUp called with meet:", meet);

  MeetUp.create({name: meet.name, cal_start: meet.cal_start, cal_end: meet.cal_end, description: meet.description, slots: meet.slots, attendees: []}, function(err, newMeetUp) {
                  console.log("meetup create")
                  if (err) {
                    console.log("Error when creating meetUp");
                    response.status(500).send(JSON.stringify(err));
                    return;
                  } else {
                    console.log('Created MeetUp with ID ', newMeetUp._id);
                    newMeetUp.save({}, function() {
                      response.end(JSON.stringify(newMeetUp));
                    }, function errorHandling(err) {
                      response.status(500).send(JSON.stringify(err));
                    });
                  }
                });
});

app.route('/meetUp/:id')
  //gets the meetup based on its id. browser side gets id through the url.
  .get(function(request, response) { //retrieve meetUp
    console.log(request.params.id);

    var id = request.params.id;
    MeetUp.findOne({_id: id}, function(err, meet) {
      if (err || meet === null) {
        console.log("Error finding meetup" + id);
        response.status(401).send(err);
        return;
      }
      console.log("Meetup" + id + "has successfully been found");

      meet = JSON.parse(JSON.stringify(meet)); //make sure it's sent in correct format
      response.send(JSON.stringify(meet));
    });
  })

  //update meetUp cal when meetup info changes (NOT used for when attendee availabiliy changes)
  .post(function(request,response) {  
    console.log(request.params.id);
    var id = request.params.id;
    var toChange = request.body.change; //object of things to change?

    MeetUp.findOne({_id: id}, function(err, meet) {
      if (err || meet === null) {
        console.log("Error finding meetup" + id);
        response.status(401).send(err);
        return;
      }

      //[ADD] update meet data here
      //IMPORTANT QUESTION: what should we make editable by users?

      console.log("Meetup" + id + "updated: " + meet);      

      meet.save({}, function() {
        return response.status(200).end();
      }, function errorHandling(err) {
        response.status(500).send(JSON.stringify(err));
      });

    });
  });


app.get('/userlist/:id', function(request, response) {
  var id = request.params.id; //meet id

  MeetUp.findOne({_id: id}, function(err, meet) {
    if (err || meet === null) {
      console.log("Error finding meetup" + id);
      response.status(401).send(err);
      return;
    }

    var list = getAllUsernames(meet.attendees);
    console.log("Created user list:" + list);
    list = JSON.parse(JSON.stringify(list));
    response.send(JSON.stringify(list));
  });
});

function getAllUsernames(attendees) {
  var usernames = [];
  var arrLength = attendees.length;

  for (var i = 0; i < arrLength; i++) {
    usernames.push(attendees[i].username);
  }
  return usernames;
}

/*
 * POST
 * Create new attendee 
 */
app.post('/user', function(request, response) {
  //request should contain meetup id, and user's username, buffer (auto?), and events (opt)
  
  var id = request.body.meet_id;
  var username = request.body.username;
  var gcal_events = request.body.events; 


  MeetUp.findOne({_id: id}, function(err, meet) {
    if (err || meet === null) {
      console.log("Error finding meetup" + id);
      response.status(401).send(err);
      return;
    }

    //update meet.attendees
    var newUser = {username: username, gcal_events: gcal_events}
    meet.attendees.push(newUser);
    console.log("New user should be created and added to Meetup's attendees: " + newUser);
    
    //update meet.slots
    var slots = meet.slots;
    for (var i = 0; i < slots.length; i++) { //can change logic later
      var evt = slots[i].time;
      if (!gCalContainsEvt(gcal_events, evt)) {
        slots[i].available_users.push(username);
      }
    }
    meet.slots = slots;
    console.log("Meetup slots should be updated to include " + username + ": " + meet.slots);

    meet.save({}, function() {
      return response.status(200).end();
    }, function errorHandling(err) {
      response.status(500).send(JSON.stringify(err));
    });

  });

});

function gCalContainsEvt(gCal, evt) {
  for (var i=0; i<gCal.length; i++) {
    if (gCal[i].time === evt) {
      return true;
    }
  }
  return false;
}

/*
 * edit availability of current user. this is called for every single slot
 * request.body contains: 
 *    username: 
 *    available: bool to indicate if changing to availability or unavailability
 *    date_change: [String] ISO0Strings of all 15 min increments that are changing
 */
app.post('/attendee/:id', function(request, response) { 

  var id = request.params.id; //meet id
  var username = request.body.username;
  var slot = request.body.slot;

  MeetUp.findOne({_id: id}, function(err, meet) {
    if (err || meet === null) {
      console.log("Error finding meetup" + id);
      response.status(401).send(err);
      return;
    }
    /* IMPORTANT: this should be checked in Angular. Saves time
        if (username === null || !foundUsername(meet.attendees)) {
          console.log("username" + username + "not found");
          response.status(400).send("No existing username");
          return;
        }
    */

    var x;
    for (var i = 0; i < meet.slots.length; i++) { //there should be more efficient way to find slot
      if (meet.slots[i] === slot) {
        if (meet.slots[i].available_users.contains(username)) {
          meet.slots[i].available_users.pop(username); //is pop a function?
        
        } else {
          meet.slots[i].available_users.push(username);
        }
        console.log("user availability for " + username + "should be updated.");
        console.log("meet.slots slot at time" + meet.slots[i] + " with attendees " + meet.attendees);
        break;
      }
    }


    meet.save({}, function() {
      return response.status(200).end();
    }, function errorHandling(err) {
      response.status(500).send(JSON.stringify(err));
    });

  });

}); 


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





