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
			cal_start: meetUp.date_start,
			cal_end: meetUp.date_end,
			description: meetUp.description
		}, function (err, meetUpObj) {
			if (err) {
				console.error('Error creating meet up', err);
			} else {
				console.log('Adding meetup', meetUpObj.name, ' with ID', meetUpObj._id, ': ', meetUpObj);
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