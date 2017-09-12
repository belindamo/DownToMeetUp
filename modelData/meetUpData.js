"use strict";

//test data for webserver

(function() {

	//fake test Schema
	var schemaInfo = {
	  load_date_time: "Sun Aug 13 2017 01:45:15 GMT-0700 (PDT)",
	  __v: 0,
	  _id: "57231f1b30e4351f4e9f4bf6"
	}; 

	// //init attendees. attendees won't have this id.
	// var attendee1 = {username: "Janel"};
	// var attendee2 = {username: "Belinda"};
	// var attendee3 = {username: "Catherine"};
	// var attendee4 = {username: "Talbot"};
	// var attendee5 = {username: "Cenobio"};
	// var attendee6 = {username: "Tony"};
	// var attendee7 = {username: "Thomas"};
	// var attendee8 = {username: "Emily"};
	// var attendee9 = {username: "Ann"};
	// var attendee10 = {username: "Beach party"}; //meetup1
	// var attendee11 = {username: "Study Session"}; //meetup2
	// var attendee12 = {username: "Okada meeting"}; //meetup3

	// var attendees = [attendee1, attendee2, attendee3, attendee4, attendee5, attendee6, attendee7, attendee8, attendee9, attendee10, attendee11, attendee12];

	// //create slots, attendees

	// //meetUp1 slots and attendees
	// var slots1;
	// var attendees1;
	//init meetups

	//IMPORTANT: hopefully this is what iso string looks like?
	var meetUp1 = {name: "Beach party", cal_start: "2017-08-17 17:00:00", cal_end: "2017-08-30 22:00:00", description: "location at Half Moon Bay. We'll also need to double check weather just in case"};
	var meetUp2 = {name: "Study Session", cal_start: "2017-09-01 09:00:00", cal_end: "2017-09-05 18:00:00", description:"I can't wait to study ! ! !"};
	var meetUp3 = {name: "Okada House meeting", cal_start: "2017-10-11 15:15:00", cal_end: "2017-10-30 18:45:00", description: ""};

	var meetUps = [meetUp1, meetUp2, meetUp3];

	var meetUpModel = function(meetUpId) {
		for (var i = 0; i < meetUps.length; i++) {
			if (meetUps[i]._id === meetUpId) {
				return meetUps[i];
			}
		}
		return null;
	};

	var meetUpListModel = function() {
		return meetUps;
	}

	var schemaModel = function() {
		return schemaInfo;
	};

	var models = {
		meetUpModel: meetUpModel,
		meetUpListModel: meetUpListModel,
		schemaInfo: schemaModel
	};

	if (typeof exports !== 'undefined') {
		exports.models = models;
	} else {
		window.models = models;
	}

})();



