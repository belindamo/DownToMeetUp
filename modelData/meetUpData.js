"use strict";

(function() {

	//fake test Schema
	var schemaInfo = {
	  load_date_time: "Sun Aug 13 2017 01:45:15 GMT-0700 (PDT)",
	  __v: 0,
	  _id: "57231f1b30e4351f4e9f4bf6"
	}; 

	//init calendars. calendars won't have this id.
	var calendar1 = {username: "Janel"};
	var calendar2 = {username: "Belinda"};
	var calendar3 = {username: "Catherine"};
	var calendar4 = {username: "Talbot"};
	var calendar5 = {username: "Cenobio"};
	var calendar6 = {username: "Tony"};
	var calendar7 = {username: "Thomas"};
	var calendar8 = {username: "Emily"};
	var calendar9 = {username: "Ann"};
	var calendar10 = {username: "Beach party"}; //meetup1
	var calendar11 = {username: "Study Session"}; //meetup2
	var calendar12 = {username: "Okada meeting"}; //meetup3

	var calendars = [calendar1, calendar2, calendar3, calendar4, calendar5, calendar6, calendar7, calendar8, calendar9, calendar10, calendar11, calendar12];

	//init meetups
	var meetUp1 = {name: "Beach party", date_start: "2017-08-17 00:00:00", date_end: "2017-08-30 00:00:00", time_start: "2017-08-17 17:00:00", time_end: "2017-08-17 22:00:00", main_calendar: calendar10, user_calendars: [calendar1, calendar2, calendar3]};
	var meetUp2 = {name: "Study Session", date_start: "2017-09-01 00:00:00", date_end: "2017-09-05 00:00:00", time_start: "2017-09-01 09:00:00", time_end: "2017-09-01 18:00:00", main_calendar: calendar11, user_calendars: [calendar4, calendar5]};
	var meetUp3 = {name: "Okada meeting", date_start: "2017-10-11 00:00:00", date_end: "2017-10-30 00:00:00", time_start: "2017-10-11 15:15:00", time_end: "2017-10-11 18:45:00", main_calendar: calendar12, user_calendars: [calendar6, calendar7, calendar8, calendar9]};

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



