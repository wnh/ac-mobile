'use strict';

angular.module('CACMobile')
.controller('MapCtrl', function ($scope, location, ConnectionManager, ResourceFactory, Bounds) {

	$scope.latitude = 50.9831700;
	$scope.longitude = -118.2023000;
	$scope.bounds = function () {
		return Bounds.getBounds(); 
	}

	$scope.$watch(function () { return Bounds.getBounds(); },
    	function(oldval,newval) {
    		if (oldval != newval) {
    			console.log("Detected change of bounds");
    			b = Bounds.getBounds();
    			getLocations(b.nelon,b.nelat,b.swlon,b.swlat);
    		} else {
    			console.log("Detected init change");
    		}
    	},true);

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

	ConnectionManager.offline(function () {
		$location.path("region-list");			
	});

	$scope.updatePosition = function () {
		getPostion();
	};

	   //! Get the current position
	   getPostion();
	   Bounds.setBounds(40,40,60,60);
  }); // end MapCtrl controller
