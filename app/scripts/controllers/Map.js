'use strict';

angular.module('App')
  .controller('MapCtrl', function ($scope, getPosition, Data) {
	 
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
	 
	 var getUrlForRegion = function (region){
		 var bulletinUrl = 'http://www.avalanche.ca/dataservices/cac/bulletins/xml/'; // \todo make this a config param
		 return bulletinUrl + region; 
	 }
	   	
	 
	 $scope.getData =  function () {
		 Data.get(getUrlForRegion($scope.region), transform).then(
				 function (data)
				 {
					 $scope.remoteData = data; 
				 });
	 };
  });


 