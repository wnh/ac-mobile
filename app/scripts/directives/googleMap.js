'use strict';

angular.module('CACMobile')
.directive('googleMap', function($window, Bounds, $rootScope, $location, Observation){

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

       if (typeof(google) != undefined) {

        var activeInfoWindow = null;

         var mapOptions = {zoom: 6, streetViewControl: false, zoomControl: false, center: new google.maps.LatLng(scope.latitude, scope.longitude), mapTypeId: google.maps.MapTypeId.TERRAIN};
         var map = new google.maps.Map(elem[0], mapOptions);

           google.maps.event.addListener(map, 'idle', function() {
            var bounds = map.getBounds();
            var ne = bounds.getNorthEast();
            var sw = bounds.getSouthWest();
            scope.$apply(Bounds.setBounds(ne.lng(),ne.lat(),sw.lng(),sw.lat()));
  });

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
         activeInfoWindow = infoWindow;
       }

       google.maps.event.addListener(infoWindow,'closeclick',function(){
         window.localStorage.setItem("first", "1");
       });

       google.maps.event.addListener(marker, 'click', function() {
            if (activeInfoWindow) {
              activeInfoWindow.close();
            };
            infoWindow.open(map,marker);
    activeInfoWindow = infoWindow;
  });

      //});

// This is a hack to get around some infowindow closing bug with Android 2.3
// https://code.google.com/p/gmaps-api-issues/issues/detail?id=5397
google.maps.event.addListener(infoWindow, 'domready', function() {
  var infoWindowCloseButton = $($($("#infoWindowContent").parents()[2]).children()[0]);
  infoWindowCloseButton.click(function(){
    infoWindow.close();
  });
});

var locMarkers = [];
var activeInfoWindow = null;

var locUpdate = function(newValue,oldValue) {
  console.log("Loading markers as locations have changed...")
  var loclength = 0
  if (scope.locations)  {
    loclength = scope.locations.length
  }
  for (var i=0; i < locMarkers.length; i++) {
    locMarkers[i].setMap(null);
  }
  locMarkers = [];
  for (var i=0; i < loclength; i++) {
    locMarkers.push(createLocMarker(scope.locations[i]));
  }
}

var loadObs = function(event) {
  Observation.setIds(event.data)
  scope.$apply($location.path('/obs-list'))
}

var createLocMarker = function(loc) {
  //Set up the marker at the right position
  var locLatlng = new google.maps.LatLng(loc.latitude,loc.longitude);
  var locMarker = new google.maps.Marker({
    position: locLatlng,
    map: map,
    title:"Location Marker"
  });

  //Build the info window content here, including a button we'll listen for later
  var buttonid = "but" + loc.id;
  var locContent = "Location is at " + loc.latitude + "," + loc.longitude + "<br />";
  locContent += "Location has " + loc.observation_id.length + " observations <br />";
  locContent += "<button id=\"" + buttonid + "\">View Obs</button>";
  var locInfoWindow = new google.maps.InfoWindow({
    content: locContent
  });


  //Add click listener to open the info window, including tracking which window is open
  google.maps.event.addListener(locMarker, 'click', function() {
    if (activeInfoWindow) {
      activeInfoWindow.close();
    }
    locInfoWindow.open(map,locMarker);

    activeInfoWindow = locInfoWindow;
  });

  // Once the info window opens, and dom is ready, add a jquery listener to the button
  google.maps.event.addListener(locInfoWindow,'domready', function () {
    $("#"+buttonid).click(loc.observation_id,function(eventObject) {loadObs(eventObject)});
  })
  return locMarker;
}





       //! watch for change in lat or long and call posUpdate if there is one, adjusting the map centre to the specified lat long
       var posUpdate = function (newValue, oldValue) {
         var newLatLng = new google.maps.LatLng(scope.latitude, scope.longitude);
         map.panTo(newLatLng);
         marker.setPosition(newLatLng);
       };
       scope.$watch('latitude',posUpdate);
       scope.$watch('longitude',posUpdate);
       scope.$watch('locations',locUpdate,true);
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
