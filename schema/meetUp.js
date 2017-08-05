
var mongoose = require('mongoose');

var calendarSchema = new mongoose.Schema({
	name: String,
});

//FIX - date range is string?
var meetUpSchema = new mongoose.Schema({
	name: String,
	id: String,
	date_start: Date,
	date_end: Date,
	time_start: Date,
	time_end: Date,
	main_calendar: calendarSchema
});

var MeetUp = mongoose.model('MeetUp', meetUpSchema);

module.exports = MeetUp;