'use strict';

angular.module('CACMobile')
.controller('MapCtrl', function ($scope, location, ConnectionManager, ResourceFactory, Bounds) {

	Bounds.setBounds(40,40,60,60);

	$scope.latitude = 50.9831700;
	$scope.longitude = -118.2023000;

	function getPostion () {
		location.getPosition().then(
			function (position){
				$scope.latitude = position.coords.latitude;
				$scope.longitude = position.coords.longitude;
			});
	}


	function getLocations (nelon, nelat, swlon, swlat) {
		ResourceFactory.location().query({nelon: nelon, nelat: nelat, swlon: swlon, swlat: swlat},
			function(response) {
				$scope.locations = response;
			},
			function(response) {
				$scope.locations = response;
			})
	}

	$scope.updatePosition = function () {
		getPostion();
	};

	   //! Get the current position
	   getPostion();
	   
    $scope.$watch(function () { return Bounds.getBounds(); },
    	function(oldval,newval) {
    		if (oldval != newval) {
    			var b = Bounds.getBounds();
    			$scope.bounds = Bounds.getBounds();
    			getLocations(b.nelon,b.nelat,b.swlon,b.swlat);
    		}
    	},true);
    $scope.bounds = Bounds.getBounds();
  }); // end MapCtrl controller
