'use strict';

var dtmuApp = angular.module('dtmuApp', ['ngRoute', 'ngMaterial', 'ngResource', 'ngDialog']);

dtmuApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        	when('/', {
        		templateUrl: 'mainTemplate.html',
        		controller: 'MainController'
        	}).
        	when('/meetUps/:meetUpId', {
        		templateUrl: 'components/meetUp/meetUp.html',
        		controller: 'MeetUpController'
        	});
    }]);

dtmuApp.controller('MainController', ['$scope', '$location', '$resource', 'ngDialog', '$rootScope',
		function ($scope, $location, $resource, ngDialog, $rootScope) {
			$scope.main = {};
			$scope.main.info = {};

			$scope.$on('newMeetUp', function(err, meetUp) {
	        	$location.path("/meetUps/" + meetUp.id);
	        });

	        $scope.main.generate = function() {
	        	$scope.main.info["startDate"] = startDate;
	        	$scope.main.info["endDate"] = endDate;
	        	$scope.main.info["startTime"] = $('#start').timepicker('getTime', startDate);
	        	$scope.main.info["endTime"] = $('#end').timepicker('getTime', startDate);

	        	var newMeetUpRes = $resource("/meetUp");
	        	newMeetUpRes.save($scope.main.info, function(meetUp) {
	        		console.log(meetUp);
	        		$rootScope.$broadcast('newMeetUp', meetUp);
	        	});
	        };

	    // $scope.main.FetchModel("/", function() {});
	}]);