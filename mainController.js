'use strict';

var dtmuApp = angular.module('dtmuApp', ['ngRoute', 'ngMaterial', 'ngResource', 'ngDialog']);

dtmuApp.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
        $routeProvider.
        	when('/home', {
        		templateUrl: 'components/home/home.html',
        		controller: 'HomeController'
        	}).
        	when('/meetUps/:meetUpId', {
        		templateUrl: 'components/meetUp/meetUp.html',
        		controller: 'MeetUpController'
        	}).
        	otherwise({
        		redirectTo: '/home'
        	});
        $locationProvider.html5Mode(true);
    }]);

dtmuApp.controller('MainController', ['$scope', '$location', '$resource', 'ngDialog', '$rootScope',
		function ($scope, $location, $resource, ngDialog, $rootScope) {
			$scope.main = {};
	}]);