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

	$scope.updatePosition = function () {
		getPostion();
	};

	   //! Get the current position
	   getPostion();

  }); // end MapCtrl controller

angular.module('CACMobile')
.directive('googleMap', function($window, $location){

	return function (scope, elem, attrs) {
		function HomeControl(controlDiv, map) {
			// Set CSS styles for the DIV containing the control
			// Setting padding to 5 px will offset the control
			// from the edge of the map
			controlDiv.className = 'map-control-container'

			var controlUI = document.createElement('div');
			controlUI.className = 'map-control';
			controlUI.title = 'Click to set the map to Home';
			controlDiv.appendChild(controlUI);

			var controlText = document.createElement('div');
			controlText.className = 'map-control-text'
			controlText.innerHTML = '<strong>Home</strong>';
			controlUI.appendChild(controlText);

			google.maps.event.addDomListener(controlUI, 'click',
				function() { map.setCenter(new google.maps.LatLng(scope.latitude, scope.longitude))});
		}

		if (typeof(google) != undefined){

			var mapOptions = {zoom: 6, streetViewControl: false, zoomControl: false, center: new google.maps.LatLng(scope.latitude, scope.longitude)};
			var map = new google.maps.Map(elem[0], mapOptions);

		 //! Add region overlay as KML Layer
		 var kmlUrl = 'http://avalanche.ca:81/KML/All_Regions_Low.kmz'; //\todo make this a config parameter //to force update of kml add and increment num ?a=1 //'file:///C:/doc.kml'; //'https://developers.google.com/kml/training/westcampus.kml';
		 var kmlOptions = {
		 	clickable: true,
		   suppressInfoWindows: true, //! \todo enable this and make infowindows display nice information see git issue
		   preserveViewport: true,
		   map: map
		};
		var kmlLayer = new google.maps.KmlLayer(kmlUrl, kmlOptions);

		google.maps.event.addListener(kmlLayer, 'click', function(kmlEvent) {
			var region = kmlEvent.featureData.name;
			var path = "/region-details/" + region;
				scope.$apply($location.path(path));
			 });
		 //!

		 var myLatlng = new google.maps.LatLng(scope.latitude,scope.longitude);


		 var marker = new google.maps.Marker({
		 	position: myLatlng,
		 	map: map,
		 	title:"My Location"
		 });

		 var contentString = '<div id="infoWindowContent"><strong>You are here!</strong>'+'<br />'+
		 'Tap region to see forecast</div>';

		 var infoWindow = new google.maps.InfoWindow({
		 	content: contentString
		 });

		 if (window.localStorage.getItem("first") != "1") {
		 	infoWindow.open(map,marker);
		 }

		 google.maps.event.addListener(infoWindow,'closeclick',function(){
			window.localStorage.setItem("first", "1");
		});

		 google.maps.event.addListener(marker, 'click', function() {
 			 infoWindow.open(map,marker);
		});

// This is a hack to get around some infowindow closing bug with Android 2.3
// https://code.google.com/p/gmaps-api-issues/issues/detail?id=5397
		 google.maps.event.addListener(infoWindow, 'domready', function() {
		 	var infoWindowCloseButton = $($($("#infoWindowContent").parents()[2]).children()[0]);
		 	infoWindowCloseButton.click(function(){
		 		infoWindow.close();
		 	});
		 });

		 //! watch for change in lat or long and call posUpdate if there is one, adjusting the map centre to the specified lat long
		 var posUpdate = function (newValue, oldValue) {
		 	var newLatLng = new google.maps.LatLng(scope.latitude, scope.longitude);
		 	map.panTo(newLatLng);
		 	marker.setPosition(newLatLng);
		 };
		 scope.$watch('latitude',posUpdate);
		 scope.$watch('longitude',posUpdate);

		 //!

		 //! add home button
		 var homeControlDiv = document.createElement('div');
		 var homeControl = new HomeControl(homeControlDiv, map);
		 //homeControlDiv.index = 1;
		 map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
		 //!

		} //End if(google)


	};
}); // end googleMap directive
