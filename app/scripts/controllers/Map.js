'use strict';

angular.module('CACMobile')
  .controller('MapCtrl', function ($scope, $location, location, Data, ConnectionManager) {
	  
		$scope.latitude = 50.9831700;
		$scope.longitude = -118.2023000;

		function getPostion () {
		  location.getPosition().then(
				function (position){
				  $scope.latitude = position.coords.latitude;
				  $scope.longitude = position.coords.longitude;
				});
		}

		ConnectionManager.offline(function () {
			$location.path("region-list");			
		});

		$scope.updatePosition = function () {
	        getPostion();
	    };

	   //! Get the current position
		getPostion();
	
  }); // end MapCtrl controller


angular.module('CACMobile')
.directive('googleMap', function($window){

	return function (scope, elem, attrs) {

		function HomeControl(controlDiv, map) {
			// Set CSS styles for the DIV containing the control
			// Setting padding to 5 px will offset the control
			// from the edge of the map
			controlDiv.style.padding = '5px';

			// Set CSS for the control border
			var controlUI = document.createElement('div');
			controlUI.style.backgroundColor = 'white';
			controlUI.style.borderStyle = 'solid';
			controlUI.style.borderWidth = '1px';
			controlUI.style.borderColor = 'lightGrey';
			controlUI.style.cursor = 'pointer';
			//ontrolUI.style.textAlign = 'center';
			controlUI.title = 'Click to set the map to Home';
			controlDiv.appendChild(controlUI);

			// Set CSS for the control interior
			var controlText = document.createElement('div');
			controlText.style.paddingLeft = '4px';
			controlText.style.paddingBottom = '1px';
			controlText.style.paddingTop = '1px';
			controlText.style.paddingRight = '4px';
			controlText.innerHTML = '<b>Home</b>';
			controlUI.appendChild(controlText);

			google.maps.event.addDomListener(controlUI, 'click', 
			    function() { map.setCenter(new google.maps.LatLng(scope.latitude, scope.longitude))});
		}

		if (typeof(google) != undefined){

		 var mapOptions = {zoom: 6, streetViewControl: false, zoomControl: false, center: new google.maps.LatLng(scope.latitude, scope.longitude)};
		 var map = new google.maps.Map(elem[0], mapOptions);
		 
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
			    var path = "#/region-details/" + region;
			    $window.location.href = path; //outside of scope so $location doesnt seem to work, is there a more angular way to do this *hack* using this seems to destroy back ability
			  });
		 //!

		 //! watch for change in lat or long and call posUpdate if there is one, adjusting the map centre to the specified lat long 	 
		 var posUpdate = function (newValue, oldValue) { map.panTo(new google.maps.LatLng(scope.latitude, scope.longitude)) };
		 scope.$watch('latitude',posUpdate);
		 scope.$watch('longtitude',posUpdate);
		 //!

		 //! add home button
		 var homeControlDiv = document.createElement('div');
		 var homeControl = new HomeControl(homeControlDiv, map);
		 homeControlDiv.index = 1;
		 homeControlDiv.style.zIndex = '1000';
		 map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
		 //!

		} //End if(google)
		 

	};
}); // end googleMap directive