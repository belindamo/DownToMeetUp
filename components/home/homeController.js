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
	        	// TODO ellen general_cal_events

	        	var newMeetUpRes = $resource("/meetUp");
	        	$location.path("/meetUps/" + "1"); // will comment this out when backend is working
	        	newMeetUpRes.save($scope.main.info, function(meetUp) {
	        		console.log(meetUp);
	        		$rootScope.$broadcast('newMeetUp', meetUp);
	        	});
	        };

	    // $scope.main.FetchModel("/", function() {});
	}]);