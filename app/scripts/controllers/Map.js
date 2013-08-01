'use strict';

angular.module('App')
  .controller('MapCtrl', function ($scope, $location, location, Data) {
	  
	  $scope.latitude = -34.397; //\todo make config params
	  $scope.longitude = 150.644;
	  
	  $scope.updatePosition = function () {
	        location.getPosition().then(
	        		function (position){
	        			  $scope.latitude = position.coords.latitude;
	        			  $scope.longitude = position.coords.longitude;
	        		  });
	    };
	
  }); // end MapCtrl controller


angular.module('App')
.directive('googleMap', function($window){
	return function (scope, elem, attrs) {
		
		 var mapOptions = {zoom: 8, center: new google.maps.LatLng(scope.latitude, scope.longitude)};
		 var map = new google.maps.Map(elem[0], mapOptions);
		 
		 /*
		 //$('#map-canvas').height = $(window).height();
		 
		 window.onresize = function(){
			 //$('#map-canvas').height = $(window).height();
			 google.maps.event.trigger(map, 'resize');
			 };*/
		 
		 
		 //! Add region overlay as KML Layer
		 var kmlUrl = 'http://avalanche.ca:81/KML/CACBulletinRegions.kml'; //\todo make this a config parameter //to force update of kml add and increment num ?a=1 //'file:///C:/doc.kml'; //'https://developers.google.com/kml/training/westcampus.kml';
		 var kmlOptions = {
		   clickable: true,		 
		   suppressInfoWindows: true, //! \todo enable this and make infowindows display nice information see git issue
		   preserveViewport: true,
		   map: map
		 };
		 var kmlLayer = new google.maps.KmlLayer(kmlUrl, kmlOptions);
		 
		 google.maps.event.addListener(kmlLayer, 'click', function(kmlEvent) {
			    var region = kmlEvent.featureData.name;
			    var path = "/#/region-details/" + region;
			    $window.location.href = path; //outside of scope so $location doesnt seem to work, is there a more angular way to do this *hack* using this seems to destroy back ability
			  });
		 //!

		 //! watch for change in lat or long and call posUpdate if there is one, adjusting the map centre to the specified lat long 	 
		 var posUpdate = function (newValue, oldValue) { map.panTo(new google.maps.LatLng(scope.latitude, scope.longitude)) };
		 scope.$watch('latitude',posUpdate);
		 scope.$watch('longtitude',posUpdate);
		 //! 

	};
}); // end googleMap directive