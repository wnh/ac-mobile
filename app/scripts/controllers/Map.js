'use strict';

angular.module('CACMobile')
.controller('MapCtrl', function ($scope, $location, location, Data, ConnectionManager, Observation) {

	$scope.latitude = 50.9831700;
	$scope.longitude = -118.2023000;

	function getPostion () {
		location.getPosition().then(
			function (position){
				$scope.latitude = position.coords.latitude;
				$scope.longitude = position.coords.longitude;
			});
	}

	function getObs () {
		Observation.all({},
		//success
		function(response) {
			$scope.observations = response;
		},
		//failure
		function(response) {
			$scope.observations = response;
		}
		)
	}

	getObs();

	ConnectionManager.offline(function () {
		$location.path("region-list");			
	});

	$scope.updatePosition = function () {
		getPostion();
	};

	   //! Get the current position
	   getPostion();
  }); // end MapCtrl controller
