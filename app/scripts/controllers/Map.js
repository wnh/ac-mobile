'use strict';

angular.module('App')
  .controller('MapCtrl', function ($scope, getPosition, RemoteData) {
	 
	  $scope.latitude = 0;
	  $scope.longitude = 0;
	  
	  $scope.updatePosition = function () {
	        getPosition.update().then(
	        		function (position){
	        			  $scope.latitude = position.coords.latitude;
	        			  $scope.longitude = position.coords.longitude;
	        		  });
	    };
	    
	 var transform = function(result) {
			var json = x2js.xml_str2json(result);
			return json;
			};   
	 $scope.remoteData = 'test';   
	 $scope.region = 'south-coast';
	 
	 $scope.getData =  function () {
		 RemoteData.get($scope.region, transform).then(
				 function (data)
				 {
					 $scope.remoteData = data; 
				 });
	 };
  });


 