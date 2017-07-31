'use strict';

var dtmuApp = angular.module('dtmuApp', ['ngRoute', 'ngMaterial', 'ngResource', 'ngDialog']);

dtmuApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        	when('/', {
        		templateUrl: 'mainTemplate.html',
        		controller: 'MainController'
        	}).
        	when('/meetUp/:id', {
        		templateUrl: 'components/meetUp.html',
        		controller: 'MeetUpController'
        	});
    }]);

dtmuApp.controller('MainController', ['$scope', '$location', '$resource', 'ngDialog',
		function ($scope, $location, $resource, ngDialog) {
			$scope.main = {};
			$scope.main.FetchModel = function(url, doneCallback) {
	            var xhr = new XMLHttpRequest();

	            var xhrHandler = function() {
	                if (this.readyState !== 4) { // DONE
	                    return;
	                }
	                if (this.status !== 200) { // OK
	                    console.log("ERROR");
	                    return;
	                }
	                var response = xhr.response;
	                doneCallback(response);
	            };

	            xhr.responseType = "json";
	            xhr.onreadystatechange = xhrHandler;
	            xhr.open("GET", url);
	            xhr.send();
	        };

	        $scope.main.generate = function() {
	        	var newMeetUpRes = $resource("/meetUp");
	        	newMeetUpRes.save($scope.main, function(meetUp) {
	        		$location.path("/meetUp/" + meetUp.id);
	        	})
	        }

	    // $scope.main.FetchModel("/", function() {});
	}]);