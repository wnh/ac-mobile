'use strict';

angular.module('CACMobile')
.controller('MapCtrl', function ($scope, location) {

	$scope.latitude = 50.9831700;
	$scope.longitude = -118.2023000;

	function getPostion () {
		location.getPosition().then(
			function (position){
				$scope.latitude = position.coords.latitude;
				$scope.longitude = position.coords.longitude;
			});
	}
	   //! Get the current position
	   getPostion();

  }); // end MapCtrl controller
