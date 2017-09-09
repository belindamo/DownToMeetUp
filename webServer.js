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
  console.log("webServer /meetUp called with meet:", meet);

  var generalCal = createGeneralCal(meet.cal_start, meet.cal_end); //array
  //[ADD] initialize general_cal_events with the 15 min increments?
  MeetUp.create({name: meet.name, cal_start: meet.cal_start, cal_end: meet.cal_end, description: "", general_cal_events: generalCal, attendees: [meet.username]}, function(err, newMeetUp) {
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

//[ADD]
function createGeneralCal(start, end) {
  var generalCal = [];
  var firstBlock = new Date(
    start.getFullYear(), 
    start.getMonth(), 
    start.getDate(),
    
    );

  var startHr = timeStart.getHours(); // 0-23
  var startMin = timeStart.getMinutes(); //only 00, 15, 30, 45
  var endHr = timeEnd.getHours();
  var endMin = timeEnd.getMinutes();


  return generalCal;
}

function dateAdd(date, units, interval) {
  var ret = new Date(date); //don't change original date
  var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
  switch(units.toLowerCase()) {
    case 'year'   :  ret.setFullYear(ret.getFullYear() + interval); checkRollover();  break;
    case 'quarter':  ret.setMonth(ret.getMonth() + 3*interval); checkRollover();  break;
    case 'month'  :  ret.setMonth(ret.getMonth() + interval); checkRollover();  break;
    case 'week'   :  ret.setDate(ret.getDate() + 7*interval);  break;
    case 'day'    :  ret.setDate(ret.getDate() + interval);  break;
    case 'hour'   :  ret.setTime(ret.getTime() + interval*3600000);  break;
    case 'minute' :  ret.setTime(ret.getTime() + interval*60000);  break;
    case 'second' :  ret.setTime(ret.getTime() + interval*1000);  break;
    default       :  ret = undefined;  break;
  }
  return ret;
}

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
  var buffer = request.body.buffer; // int. every increment is 15 min. so like, if buffer == 1 then buffer is 15 min
  var gcal_events = request.body.events; 


  MeetUp.findOne({_id: id}, function(err, meet) {
    if (err || meet === null) {
      console.log("Error finding meetup" + id);
      response.status(401).send(err);
      return;
    }

    //update meet.attendees
    var newUser = {username: username, buffer: buffer, gcal_events: gcal_events}
    meet.attendees.push(newUser);
    console.log("New user should be created and added to Meetup's attendees: " + newUser);
    //update meet.general_cal_events
    meet.general_cal_events = addUserToGeneralCal(meet.general_cal_events, username, buffer, gcal_events);
    console.log("Meetup general_cal_events should be updated to include " + username + ": " + meet.general_cal_events);

    meet.save({}, function() {
      return response.status(200).end();
    }, function errorHandling(err) {
      response.status(500).send(JSON.stringify(err));
    });

  });

});

//need to check if works
function addUserToGeneralCal(eventArr, un, buffer, busy) {
  var newArr = eventArr;
  var arrSize = eventArr.length;

  for (var i = 0; i < arrSize; i++) { //can change logic later
    var evt = newArr[i];
    var b1 = newArr[buffer+i];
    
    //[FIX] only works if buffer is 0 or 1

    if (!busy.contains(evt)) {

    } else if (i - buffer >= 0 && busy.contains(newArr[i-buffer])) { 

    } else if (i + buffer < arrSize && busy.contains(newArr[i+buffer])) {

    } else {
      newArr[i].available_users.push(un);
    }
  }
  return newArr;
}


/*
 * edit availability of current user
 * request.body contains: 
 *    username: 
 *    available: bool to indicate if changing to availability or unavailability
 *    date_change: [Date] of all 15 min increments that are changing
 */
app.post('/userCalendar/:id', function(request, response) { 

  var id = request.params.id; //meet id
  var username = request.body.username;
  var available = request.body.available;
  var date_change = request.body.date_change; //array of all 15 min increments being changed 

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

    //[ADD]
    meet.general_cal_events = updateGeneralEvents(meet.general_cal_events, username, available, date_change);

    meet.attendees = updateUserGCalAvailability(meet.attendees, username, available, date_change);

    console.log("user availability for " + username + "should be updated.");
    console.log("meet.general_cal_events: " + meet.general_cal_events);
    console.log("meet.attendees: " + meet.attendees);

    meet.save({}, function() {
      return response.status(200).end();
    }, function errorHandling(err) {
      response.status(500).send(JSON.stringify(err));
    });

  });

}); 


//[ADD]
function updateGeneralEvents(eventArr, un, avail, dateChange) {

}

//[ADD]
function updateUserGCalAvailability(attendees, un, avail, dateChange) {
  var u;
  var aLength = attendees.length;
  for (var i = 0; i < aLength; i++) {
    if (attendees[i].username === un) {
      u = attendees[i];
      break;
    }
  }

  var eLength = u.gcal_events.length;
  for (var j = 0; j < eLength; j++) {

  }

}

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





