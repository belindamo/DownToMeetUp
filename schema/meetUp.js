
var mongoose = require('mongoose');

var calendarSchema = new mongoose.Schema({
	name: String
});

//FIX - date range is string?
var meetUpSchema = new mongoose.Schema({
	name: String,
	user_calendars: [calendarSchema],
	date_range: String,
	main_calendar: calendarSchema
});

var MeetUp = mongoose.model('MeetUp', meetUpSchema);

module.exports = MeetUp;