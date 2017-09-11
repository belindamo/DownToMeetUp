'use strict';

dtmuApp.controller('HomeController', ['$scope', '$location', '$resource', 'ngDialog', '$rootScope',
		function ($scope, $location, $resource, ngDialog, $rootScope) {
			$scope.main.info = {};
			$scope.home = {};

			$scope.$on('newMeetUp', function(err, meetUp) {
	        	$location.path("/meetUps/" + meetUp.id);
	        });

	        $scope.$on('$viewContentLoaded', function() {
   				$('input[name="daterange"]').daterangepicker();
   				$('#start').timepicker();
   				$('#end').timepicker();				
			});

	   //      $scope.home.loadDatePicker = function() {
	   //     	    $('input[name="daterange"]').daterangepicker();
				// var startDate = $('input[name="daterange"]').data('daterangepicker').startDate;
				// var endDate = $('input[name="daterange"]').data('daterangepicker').endDate;	
	   //      }

	        $scope.main.generate = function() {
	        	var startDate = $('input[name="daterange"]').data('daterangepicker').startDate;
				var endDate = $('input[name="daterange"]').data('daterangepicker').endDate;	
	        	$scope.main.info["startDate"] = startDate;
	        	$scope.main.info["endDate"] = endDate;
	        	$scope.main.info["startTime"] = $('#start').timepicker('getTime', startDate);
	        	$scope.main.info["endTime"] = $('#end').timepicker('getTime', startDate);

	        	// TODO janel: Date objects --> cal_start and cal_end by using toISOString()
	        	var calStart = new Date("2017-09-01T09:00:00Z"); //Placeholder
	        	var calEnd = new Date("2017-09-02T10:00:00Z");  //Placeholder
	        	// TODO ellen slots

	        	//Generating slot times using start day...
	        	var slotTimes = [];
	        	var startTimeMoment = moment(calStart);
	        	var endTimeMoment = startTimeMoment.clone();
	        	endTimeMoment.set('hour', calEnd.getHours()).set('minute', calEnd.getMinutes()).set('second', calEnd.getSeconds());

	        	var currentTimeMoment = startTimeMoment.clone();
	        	while (currentTimeMoment.isBefore(endTimeMoment)) {
	        		slotTimes.push(currentTimeMoment.clone());
	        		currentTimeMoment.add(moment.duration(15, 'minutes'));
	        	}

	        	//Generating rest of the slots for remaining days...
	        	/*
	        	slots = [];
	        	var currentSlotDay = startTimeMoment

	        	var exclusiveSlotDay = 

	        	for (var i = 0; i < slotTimes.length; i++) {
	        		var singleSlot = slotTimes[i].clone().add(moment.duration(1, 'days'));
	        		slots.push(singleSlot);
	        	}

	        	$scope.main.slots = slots;
	        	*/
	        	//Printing out slots...
	        	console.log("# of slots: " + slotTimes.length);
	        	for(var i = 0; i < slotTimes.length; i++) {
	        		console.log(slotTimes[i].toISOString());
	        	}

	        	var newMeetUpRes = $resource("/meetUp");
	        	//$location.path("/meetUps/" + "1"); // will comment this out when backend is working
	        	$location.path("/login");
	        	newMeetUpRes.save($scope.main.info, function(meetUp) {
	        		console.log(meetUp);
	        		$rootScope.$broadcast('newMeetUp', meetUp);
	        	});
	        };

	    // $scope.main.FetchModel("/", function() {});
	}]);