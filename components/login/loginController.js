'use strict';

dtmuApp.controller('LoginController', ['$scope', '$location', '$resource', '$routeParams',
		function ($scope, $location, $resource, $routeParams) {
			$scope.main.userN = "";
			$scope.main.pass = "";
			$scope.main.signedInDTMU = false;

			$scope.main.addUser = function() {
				$location.path("/meetUps/" + "1");
				$scope.main.signedInDTMU = true;
				console.log($scope.main.userN);
			};
		}]);