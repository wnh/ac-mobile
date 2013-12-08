'use strict';

angular.module('CACMobile')
.controller('ObservationViewMapCtrl', function ($scope, location, ResourceFactory, Bounds, $timeout) {
   $scope.latitude = 50.9831700;
   $scope.longitude = -118.2023000;
   $scope.locations = [];

   function getPostion () {
      location.getPosition().then(
         function (position){
            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;
         });
   }

   function getLocations (nelon, nelat, swlon, swlat, zoom) {
      //TODO: Some rate control here?
      if (zoom > 8) {
         ResourceFactory.location().query({nelon: nelon, nelat: nelat, swlon: swlon, swlat: swlat, clustered: false, from: $scope.from.toDateString(), to: $scope.to.toDateString()},
            function(response) {
               $scope.locations = response;
            },
            function(response) {
               console.log("Failed to load unclustered locations")
            })
      }
      else 
      {
         ResourceFactory.location().query({nelon: nelon, nelat: nelat, swlon: swlon, swlat: swlat, clustered: false, from: $scope.from.toDateString(), to: $scope.to.toDateString()},
            function(response) {
               $scope.locations = response;
            },
            function(response) {
               console.log("Failed to load clustered locations")
            })
      }
   }
      //! Get the current position
      getPostion();
      
      $scope.$watch(function () { return Bounds.getBounds(); },
         function(oldval,newval) {
            if (oldval != newval) {
               var b = Bounds.getBounds();
               getLocations(b.nelon,b.nelat,b.swlon,b.swlat,b.zoom);
            }
         },true);

      $scope.to = new Date();
      $scope.from = new Date(2013,11,1);
      $scope.today = new Date();
      $scope.fromOpened = false;
      $scope.toOpened = false;

  $scope.fromOpen = function() {
     $timeout(function() {
      $scope.fromOpened = true;
   });
  };

    $scope.toOpen = function() {
     $timeout(function() {
      $scope.toOpened = true;
   });
  };


});
