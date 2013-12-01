'use strict';

angular.module('CACMobile')
.controller('MapCtrl', function ($scope, $location, location, Data, ConnectionManager, Observation) {

	$scope.latitude = 50.9831700;
	$scope.longitude = -118.2023000;

	function getPostion () {
		location.getPosition().then(
			function (position){
				$scope.latitude = position.coords.latitude;
				$scope.longitude = position.coords.longitude;
			});
	}

	function getObs () {
		Observation.all({},
		//success
		function(response) {
			$scope.observations = response;
		},
		//failure
		function(response) {
			$scope.observations = response;
		}
		)
	}

	getObs();

	$scope.updatePosition = function () {
		getPostion();
	};

	   //! Get the current position
	   getPostion();
  }); // end MapCtrl controller

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
		 var kmlUrl = 'http://avalanche.ca:81/KML/All_Regions_Low.kmz'; //\todo make this a config parameter //to force update of kml add and increment num ?a=1 //'file:///C:/doc.kml'; //'https://developers.google.com/kml/training/westcampus.kml';
		 	clickable: true,
			var path = "/region-details/" + region;
				scope.$apply($location.path(path));
		 	infoWindow.open(map,marker);
			window.localStorage.setItem("first", "1");
		 //! watch for change in lat or long and call posUpdate if there is one, adjusting the map centre to the specified lat long
		 var posUpdate = function (newValue, oldValue) {
