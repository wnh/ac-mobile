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

	    $scope.redirect = function (url){
	    		$location.path(url);			
	    }

	   //! Get the current position
		getPostion();
	
  }); // end MapCtrl controller


angular.module('CACMobile')
.directive('googleMap', function($window){

	return function (scope, elem, attrs) {


		function MecLinkControl (controlDiv, map) {

			var controlUI = document.createElement('img');
			controlUI.title = "MEC";
			controlUI.src = 'img/AvalancheApp_inpartnership_MEC_Logo.png';
			controlUI.height = '10px';
			controlDiv.appendChild(controlUI);


			google.maps.event.addDomListener(controlUI, 'click', 
			    function() { $window.location.href = "http://www.mec.ca/";});
		}

		function CaaLinkControl (controlDiv, map) {

			var controlUI = document.createElement('img');
			controlUI.title = "CAA";
			controlUI.src = 'img/CAC_Logo.png';
			//controlUI.height = "1000px;"
			controlUI.height = '40px';
			
			controlDiv.appendChild(controlUI);

			google.maps.event.addDomListener(controlUI, 'click', 
			    function() { $window.location.href = "http://avalanche.ca/cac";});
		}

		function ListViewControl(controlDiv, map) {
			// Set CSS styles for the DIV containing the control
			// Setting padding to 5 px will offset the control
			// from the edge of the map
			controlDiv.style.padding = '5px';

			// Set CSS for the control border
			var controlUI = document.createElement('div');
			controlUI.style.backgroundColor = 'white';
			controlUI.style.borderStyle = 'solid';
			controlUI.style.borderWidth = '1px';
			controlUI.style.cursor = 'pointer';
			controlUI.style.textAlign = 'center';
			controlUI.title = 'Click view region list';
			controlDiv.appendChild(controlUI);

			// Set CSS for the control interior
			var controlText = document.createElement('div');
			controlText.style.fontFamily = 'Arial,sans-serif';
			controlText.style.fontSize = '13px';
			controlText.style.paddingLeft = '4px';
			controlText.style.paddingRight = '4px';
			controlText.innerHTML = '<b>Region List</b>';
			controlUI.appendChild(controlText);

			google.maps.event.addDomListener(controlUI, 'click', 
			    function() { $window.location.href = "#/region-list";});
		}

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
			controlUI.style.cursor = 'pointer';
			controlUI.style.textAlign = 'center';
			controlUI.title = 'Click to set the map to Home';
			controlDiv.appendChild(controlUI);

			// Set CSS for the control interior
			var controlText = document.createElement('div');
			controlText.style.fontFamily = 'Arial,sans-serif';
			controlText.style.fontSize = '13px';
			controlText.style.paddingLeft = '4px';
			controlText.style.paddingRight = '4px';
			controlText.innerHTML = '<b>Home</b>';
			controlUI.appendChild(controlText);

			google.maps.event.addDomListener(controlUI, 'click', 
			    function() { map.setCenter(new google.maps.LatLng(scope.latitude, scope.longitude))});
		}

		if (typeof(google) != undefined){

		 var mapOptions = {zoom: 6, center: new google.maps.LatLng(scope.latitude, scope.longitude)};
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

		 
		 //! add home button
		 var homeControlDiv = document.createElement('div');
		 var homeControl = new HomeControl(homeControlDiv, map);
		 homeControlDiv.index = 1;
		 map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
		 //!

/*
		 //! add region list view button
		 var listDiv = document.createElement('div');
		 var listControl = new ListViewControl(listDiv, map);
		 listDiv.index = 2;
		 map.controls[google.maps.ControlPosition.TOP_RIGHT].push(listDiv);
		 //!

		 
		 //! CAA Logo
		 var caaDiv = document.createElement('div');
		 var caaControl = new CaaLinkControl(caaDiv, map);
		 caaDiv.index = 1;
		 map.controls[google.maps.ControlPosition.TOP_LEFT].push(caaDiv);
		 //!

		 //! MEC Logo
		 var mecDiv = document.createElement('div');
		 var mecControl = new MecLinkControl(mecDiv, map);
		 mecDiv.index = 1;
		 map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(mecDiv);
		 //!
*/		 


		} //End if(google)
		 

	};
}); // end googleMap directive