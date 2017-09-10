
var mongoose = require('mongoose');

var meetUpSchema = new mongoose.Schema({
	name: String,
	cal_start: String, // Date.toISOString()
	cal_end: String, // Date.toISOString()
	description: String,
	slots: [{
		time: String, 
		available_users: [String] // usernames
	}], //array of 15 min increments
	attendees: [{ 
		username: String, 
		gcal_events: [{
			time: String, 
			event_name: String
		}]
	}]
});

var MeetUp = mongoose.model('MeetUp', meetUpSchema);

module.exports = MeetUp;