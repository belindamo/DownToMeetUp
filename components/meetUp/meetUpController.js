'use strict';

dtmuApp.controller('MeetUpController', ['$scope', '$location', '$resource', '$routeParams',
		function ($scope, $location, $resource, $routeParams,) {
			$scope.meetUp = {};
			var meetUpId = $routeParams.meetUpId;
			$scope.main.meetUpId = meetUpId;

			var meetUpRes = $resource("/meetUp/:id", {id: meetUpId});

		}]);