
var mongoose = require('mongoose');

var calendarSchema = new mongoose.Schema({
	username: String //of the user
});

var meetUpSchema = new mongoose.Schema({
	name: String,
	date_start: Date,
	date_end: Date,
	time_start: Date,
	time_end: Date,
	main_calendar: calendarSchema,
	user_calendars: [calendarSchema]
});

var MeetUp = mongoose.model('MeetUp', meetUpSchema);

module.exports = MeetUp;