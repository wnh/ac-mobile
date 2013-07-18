'use strict';

angular.module('App')
  .controller('MapCtrl', function ($scope, getPosition) {
	 
	  $scope.latitude = 0;
	  $scope.longitude = 0;
	  
	  $scope.updatePosition = function () {
	        getPosition.update().then(
	        		function (position){
	        			  $scope.latitude = position.coords.latitude;
	        			  $scope.longitude = position.coords.longitude;
	        		  });
	    };
  });
