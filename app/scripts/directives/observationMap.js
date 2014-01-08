'use strict';

angular.module('CACMobile')
.directive('observationMap', function (Bounds, $location, State,$rootScope) {

 return function(scope, elem, attrs) {
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

  var activeInfoWindow = null;
  var locMarkers = [];

  var mapOptions = {zoom: 6, streetViewControl: false, zoomControl: true, center: new google.maps.LatLng(scope.latitude, scope.longitude), mapTypeId: google.maps.MapTypeId.TERRAIN};
  var map = new google.maps.Map(elem[0], mapOptions);
  var oms = new OverlappingMarkerSpiderfier(map,{legWeight:0});

  oms.addListener('spiderfy', function(spiderfied,unspiderfied) {
    for (var i=0; i < unspiderfied.length; i++) {
      var locMarker = unspiderfied[i]
      if (locMarker.count < 9) {
        locMarker.setIcon('img/markers/icona' + locMarker.count + '.png');
      } else {
        locMarker.setIcon('img/markers/icona9plus.png');
      }
    }
  });

    oms.addListener('unspiderfy', function(spiderfied,unspiderfied) {
        for (var i=0; i < unspiderfied.length; i++) {
      var locMarker = unspiderfied[i]
      if (locMarker.count < 9) {
        locMarker.setIcon('img/markers/iconb' + locMarker.count + '.png');
      } else {
        locMarker.setIcon('img/markers/iconb9plus.png');
      }
    }
  });

  var bounds = Bounds.getBounds()

  if (bounds.set) {
    var ne = new google.maps.LatLng(bounds.nelat, bounds.nelon); 
    var sw = new google.maps.LatLng(bounds.swlat, bounds.swlon);
    var newBounds = new google.maps.LatLngBounds(sw,ne)
    map.fitBounds(newBounds);
    map.setZoom(bounds.zoom);
  }

  var updateBounds = function () {
    var bounds = map.getBounds();
    var zoom = map.getZoom();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    scope.$apply(Bounds.setBounds(ne.lng(),ne.lat(),sw.lng(),sw.lat(),zoom));
  }

  //Add listeners to update bounds whenever map is dragged, zoom level changes, or map first loads (addListenerOnce)
  google.maps.event.addListener(map, 'dragend', function() {
    updateBounds();
  });

  google.maps.event.addListener(map, 'zoom_changed', function() {
    updateBounds();
  });

  google.maps.event.addListenerOnce(map, 'idle', function() {
    if (Bounds.getBounds().set == false) {
      updateBounds();    
    }
    console.log("Setting initial bounds");
  });

var locUpdate = function(newValue,oldValue) {
  console.log("Loading markers as locations have changed...")
  for (var i=0; i < locMarkers.length; i++) {
    locMarkers[i].setMap(null);
  }
  locMarkers = [];
  var loclength = 0;
  if (scope.locations)  {
    loclength = scope.locations.length;
  }
  for (var i=0; i < loclength; i++) {
    locMarkers.push(createLocMarker(scope.locations[i]));
  }
  console.log(locMarkers);
}

var loadObs = function(observation_ids) {
  if (observation_ids.length == 1) {
    scope.$apply($location.path('/ObservationViewDetail/' + observation_ids[0]))
  } 
  else 
  {
    State.setObsIds(observation_ids)
    scope.$apply($location.path('/obsList'))
  }
}

var createLocMarker = function(loc) {
  //Set up the marker at the right position
   var locLatlng = new google.maps.LatLng(loc.latitude,loc.longitude);
   var locMarker = new google.maps.Marker()
   locMarker.setPosition(locLatlng);
   locMarker.setMap(map);
   locMarker.count = loc.observation_id.length
   if (locMarker.count < 9) {
    locMarker.setIcon('img/markers/iconb' + locMarker.count + '.png');
  } else {
    locMarker.setIcon('img/markers/iconb9plus.png');
  }
  if (loc.clustered == true) {
    locMarker.setZIndex(100);
   } else {
    locMarker.setZIndex(50);
   }
   locMarker.observations = loc.observation_id

  oms.addMarker(locMarker);
  oms.addListener('click', function(locMarker) {
    loadObs(locMarker.observations)
  });
  return locMarker;
}





       scope.$watch('locations',locUpdate,true);
       //!

       //! add home button
       var homeControlDiv = document.createElement('div');
       var homeControl = new HomeControl(homeControlDiv, map);
       map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
       //!

      }

  });
