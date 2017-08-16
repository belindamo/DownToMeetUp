"use strict";

var models = require('./modelData/meetUpData.js').models;

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/meetupproject', { useMongoClient: true });

var MeetUp = require('./schema/meetUp.js')
var SchemaInfo = require('./schema/schemaInfo.js');

var versionString = '1.0';

var removePromises = [MeetUp.remove({}), SchemaInfo.remove({})];

Promise.all(removePromises).then(function () {

	var meetUpModels = models.meetUpListModel();
	var meetUpPromises = meetUpModels.map(function (meetUp) {
		return MeetUp.create({
			name: meetUp.name,
			date_start: meetUp.date_start,
			date_end: meetUp.date_end,
			time_start: meetUp.time_start,
			time_end: meetUp.time_end,
			main_calendar: meetUp.main_calendar,
			//user_calendars: meetUp.user_calendars
		}, function (err, meetUpObj) {
			if (err) {
				console.error('Error creating meet up', err);
			} else {
				
				//meetUp.objectID = meetUpObj._id;

				/*if (meetUp.main_calendar) {
					meetUpObj.main_calendar.push({
						username: main_calendar.username
					});

					console.log("Added main_calendar with name ", main_calendar.username);
				}*/

				if (meetUp.user_calendars) {
					meetUp.user_calendars.forEach(function (user_calendar) {
						meetUpObj.user_calendars.push({
							username: user_calendar.username
						});
						//user_calendar.objectID = meetUpObj.user_calendar._id;
						console.log("Added user_calendar with name ", user_calendar.username);
					});
				}
				meetUpObj.save();
				//console.log('Adding meetup:', meetUp.name, ' with ID ', meetUp.objectID);
			}
		});
	});

	var allPromises = Promise.all(meetUpPromises).then(function () {
		
        return SchemaInfo.create({
            version: versionString
        }, function (err, schemaInfo) {
            if (err) {
                console.error('Error create schemaInfo', err);
            } else {
                console.log('SchemaInfo object created with version ', versionString);
            }
        });

	});

	allPromises.then(function () {
		mongoose.disconnect();
	});

});