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

   function getLocations () {
    console.log("updating locations...")
      //TODO: Some rate control here?
      var b = Bounds.getBounds();
      if (b.zoom > 8) {
         ResourceFactory.location().query({nelon: b.nelon, nelat: b.nelat, swlon: b.swlon, swlat: b.swlat, clustered: false, from: $scope.from, to: $scope.to},
            function(response) {
               $scope.locations = response;
            },
            function(response) {
               console.log("Failed to load unclustered locations")
            })
      }
      else 
      {
         ResourceFactory.location().query({nelon: b.nelon, nelat: b.nelat, swlon: b.swlon, swlat: b.swlat, clustered: true, from: $scope.from, to: $scope.to},
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
               getLocations();
            }
         },true);
      $scope.to = new Date();
      $scope.from = new Date();
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

  $scope.$watch(function() {return $scope.to},
    function(oldval,newval) {
      if (oldval != newval) {
        getLocations();
      }
    },true)

    $scope.$watch(function() {return $scope.from},
    function(oldval,newval) {
      if (oldval != newval) {
        getLocations();
      }
    },true)


});
