'use strict';

dtmuApp.controller('MeetUpController', ['$scope', '$location', '$resource', '$routeParams',
		function ($scope, $location, $resource, $routeParams) {
			$scope.meetUp = {};

			$scope.$on('$viewContentLoaded', function() {
   				handleClientLoad();			
			});

			var meetUpId = $routeParams.meetUpId;
			$scope.main.meetUpId = meetUpId;

			var meetUpRes = $resource("/meetUp/:id", {id: meetUpId});

			/* ------------------------------------------------------------*/
			// From https://developers.google.com/google-apps/calendar/quickstart/js

			// Client ID and API key from the Developer Console
			var CLIENT_ID = '810452075330-pp8vomlkapis0h2k6ti0l9ttsv2e0vol.apps.googleusercontent.com';

			// Array of API discovery doc URLs for APIs used by the quickstart
			var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

			// Authorization scopes required by the API; multiple scopes can be
			// included, separated by spaces.
			var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

			var authorizeButton = document.getElementById('authorize-button');
			var signoutButton = document.getElementById('signout-button');

			/**
			*  On load, called to load the auth2 library and API client library.
			*/
			function handleClientLoad() {
				gapi.load('client:auth2', initClient);
			}

			/**
			*  Initializes the API client library and sets up sign-in state
			*  listeners.
			*/
			function initClient() {
				gapi.client.init({
					discoveryDocs: DISCOVERY_DOCS,
					clientId: CLIENT_ID,
					scope: SCOPES
				}).then(function () {
			  // Listen for sign-in state changes.
			  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

			  // Handle the initial sign-in state.
			  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			  authorizeButton.onclick = handleAuthClick;
			  signoutButton.onclick = handleSignoutClick;
			});
			}

			/**
			*  Called when the signed in status changes, to update the UI
			*  appropriately. After a sign-in, the API is called.
			*/
			function updateSigninStatus(isSignedIn) {
				if (isSignedIn) {
					authorizeButton.style.display = 'none';
					signoutButton.style.display = 'block';
					listUpcomingEvents();
				} else {
					authorizeButton.style.display = 'block';
					signoutButton.style.display = 'none';
				}
			}

			/**
			*  Sign in the user upon button click.
			*/
			function handleAuthClick(event) {
				gapi.auth2.getAuthInstance().signIn();
			}

			/**
			*  Sign out the user upon button click.
			*/
			function handleSignoutClick(event) {
				gapi.auth2.getAuthInstance().signOut();
			}

			/**
			* Append a pre element to the body containing the given message
			* as its text node. Used to display the results of the API call.
			*
			* @param {string} message Text to be placed in pre element.
			*/
			function appendPre(message) {
				var pre = document.getElementById('content');
				var textContent = document.createTextNode(message + '\n');
				pre.appendChild(textContent);
			}

			/**
			* Print the summary and start datetime/date of the next ten events in
			* the authorized user's calendar. If no events are found an
			* appropriate message is printed.
			*/
			function listUpcomingEvents() {
				gapi.client.calendar.events.list({
					'calendarId': 'primary',
					'timeMin': (new Date()).toISOString(),
					'showDeleted': false,
					'singleEvents': true,
					'maxResults': 10,
					'orderBy': 'startTime'
				}).then(function(response) {
					var events = response.result.items;
					appendPre('Upcoming events:');

					if (events.length > 0) {
						for (var i = 0; i < events.length; i++) {
							var event = events[i];
							var when = event.start.dateTime;
							if (!when) {
								when = event.start.date;
							}
							appendPre(event.summary + ' (' + when + ')')
						}
					} else {
						appendPre('No upcoming events found.');
					}
				});
			}

			//belinda added stuff
			//ellen here, moved below to login controller
			// $scope.otherSignIn = false;

			// $scope.userN = "";
			// $scope.pass = "";


			// $scope.main.addUser = function() {
			// 	//post user data. currently just the username.
			// 	console.log($scope.userN);
			// };


			$(document).ready(function() {
			    // page is now ready, initialize the calendar
			    $('#my-calendar').fullCalendar({
			    	header: {
			    		left: 'title',
			    		right: 'prev, next'
			    	},
			        defaultDate: '2017-08-28',		//*** start date
			        defaultView: 'agendaWeek',
			        editable: true,
			        allDaySlot: false,
			        slotDuration: '00:15:00',		//15 minute time intervals
			        slotLabelInterval: '00:30:00',	//label every other increment
			        snapDuration: '00:15:00',		//events will align to 15 minute internvals
			        minTime: '09:00:00',			//*** start time
			        maxTime: '12:00:00',			//*** end time
			        validRange: {
				        start: moment('2017-08-26'),
				        end: moment('2017-08-31')
				    },
				    events: [
				    	{
				    		start: '2017-08-29T09:00:00',
				            end: '2017-08-29T10:00:00',
				            title: "Class"
				    	},
				    	{
				            start: '2017-08-29T10:00:00',
				            end: '2017-08-29T10:15:00',
				            rendering: 'background',
				        },
				        {
				            start: '2017-08-29T10:15:00',
				            end: '2017-08-29T10:30:00',
				            rendering: 'background',
				        },
				        {
				            start: '2017-08-29T10:30:00',
				            end: '2017-08-29T10:45:00',
				            rendering: 'background',
				        },
				        {
				            start: '2017-08-29T10:45:00',
				            end: '2017-08-29T11:00:00',
				            rendering: 'background',
				        },
				        {
				            start: '2017-08-29T11:00:00',
				            end: '2017-08-29T11:15:00',
				            rendering: 'background',
				        },
				        {
				            start: '2017-08-29T11:15:00',
				            end: '2017-08-29T11:30:00',
				            rendering: 'background',
				        },
				        {
				            start: '2017-08-29T11:30:00',
				            end: '2017-08-29T11:45:00',
				            rendering: 'background',
				        },
				        {
				            start: '2017-08-29T11:45:00',
				            end: '2017-08-29T12:00:00',
				            rendering: 'background',
				        },
				    ],

				  //   eventClick: function(event) {
				  //   	console.log(event)
				  //       $("#my-calendar").fullCalendar('removeEvents', function(event) {
				  //       	return true
						// });
				  //   }
			    });

			});

		}]);

