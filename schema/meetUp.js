
var mongoose = require('mongoose');

var meetUpSchema = new mongoose.Schema({
	name: String,
	date_start: Date,
	date_end: Date,
	time_start: Date,
	time_end: Date,
	description: String,
	general_cal_events: [{
		time: Date, 
		available_users: [string] 
	}], //array of 15 min increments
	attendees: [{ 
		username: String, 
		buffer: int, 
		gcal_events: [{
			time: Date, 
			event_name: String, 
			available: Boolean
		}] 
	}]
});

var MeetUp = mongoose.model('MeetUp', meetUpSchema);

module.exports = MeetUp;