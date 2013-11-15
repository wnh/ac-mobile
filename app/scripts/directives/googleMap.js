'use strict';

angular.module('CACMobile')
.directive('googleMap', function($window){

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

       //! Add region overlay as KML Layer
       var kmlUrl = 'http://avalanche.ca:81/KML/CACBulletinRegions.kml?a=1'; //\todo make this a config parameter //to force update of kml add and increment num ?a=1 //'file:///C:/doc.kml'; //'https://developers.google.com/kml/training/westcampus.kml';
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

var obsMarkers = [];
var activeInfoWindow = null;

var obsUpdate = function(newValue,oldValue) {
  console.log("Loading markers as observations have changed...")
  var obslength = 0
  if (scope.observations)  {
    obslength = scope.observations.length
  }
  for (var i=0; i < obsMarkers.length; i++) {
    obsMarkers.pop().setMap(null);
  }
  for (var i=0; i < obslength; i++) {
    obsMarkers.push(createObsMarker(scope.observations[i]));
  }
}

var createObsMarker = function(obs) {
  var obsLatlng = new google.maps.LatLng(obs.location.latitude,obs.location.longitude);


  var obsMarker = new google.maps.Marker({
    position: obsLatlng,
    map: map,
    title:"Observation Marker"
  });
  var comment = obs.comment || "";
  var time = obs.recorded_at || obs.submitted_at;
  var obsContent = "Observation made at " + time + "<br />";
  if (obs.photo) {
    obsContent += "<img src='"+obs.photo.tmb_url+"'/>";
  }

  var obsInfoWindow = new google.maps.InfoWindow({
    content: obsContent
  });

  google.maps.event.addListener(obsMarker, 'click', function() {
    if (activeInfoWindow) {
      activeInfoWindow.close();
    }
    obsInfoWindow.open(map,obsMarker);
    activeInfoWindow = obsInfoWindow;
  });
  return obsMarker;
}





       //! watch for change in lat or long and call posUpdate if there is one, adjusting the map centre to the specified lat long
       var posUpdate = function (newValue, oldValue) {
         var newLatLng = new google.maps.LatLng(scope.latitude, scope.longitude);
         map.panTo(newLatLng);
         marker.setPosition(newLatLng);
       };
       scope.$watch('latitude',posUpdate);
       scope.$watch('longitude',posUpdate);
       scope.$watch('observations',obsUpdate,true);
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
