'use strict';

angular.module('App')
  .controller('MapCtrl', function ($scope, location, Data) {
	  
	  window.onresize = function(){alert(test); google.maps.event.trigger(map, 'resize');};
	  
	  $scope.latitude = -34.397;
	  $scope.longitude = 150.644;
	  
	  $scope.updatePosition = function () {
	        location.getPosition().then(
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
		 Data.httpGetXml(getUrlForRegion($scope.region), transform).then(
				 function (data)
				 {
					 $scope.remoteData = data.ObsCollection.observations.Bulletin.bulletinResultsOf.BulletinMeasurements.dangerRatings; 
				 });
	 };	 
	
	 $scope.localFile = 'data.json';
	 $scope.getLocalData =  function () {
		 Data.fileRead($scope.localFile).then(
				 function (data)
				 {
					 console.log('data read func', data);
					 $scope.localData = data;
				 },
				 function (error)
				 {
					 console.log ('error reading file' + error); 
				 })
		 };
		 
	 $scope.putData = function () { 
		 Data.fileWrite($scope.localFile, JSON.stringify($scope.remoteData).split());
		 } ;	 
		 
	 
  });




angular.module('App')
.directive('googleMap', function(){
	return function (scope, elem, attrs) {
		
		 var mapOptions = {zoom: 8, center: new google.maps.LatLng(scope.latitude, scope.longitude)};
		 var map = new google.maps.Map(elem[0], mapOptions);
		 

		  var posUpdate = function (newValue, oldValue) { map.panTo(new google.maps.LatLng(scope.latitude, scope.longitude)) };
		  scope.$watch('latitude',posUpdate);
		  scope.$watch('longtitude',posUpdate);

	};
	
	
});