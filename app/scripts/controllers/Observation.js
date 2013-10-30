'use strict';

angular.module('CACMobile')
  .controller('ObservationCtrl', function ($scope, uploadService, location) {
// Set up defaults
$scope.obs = {file: null, type: "public", recorded_at:new Date().toString()};

//
$scope.uploadComplete = function (content) {
      $scope.response = JSON.parse(content); // Presumed content is a json string!
  };

  $scope.saveObs = function() {
   uploadService.send($scope.obs,$scope)
  }

  // $scope.latitude = 50.9831700;
  // $scope.longitude = -118.2023000;

   function getPosition () {
      location.getPosition().then(
         function (position){
            $scope.obs.latitude = position.coords.latitude;
            $scope.obs.longitude = position.coords.longitude;
            $scope.obs.accuracy = position.coords.accuracy;
            $scope.obs.altitude = position.coords.altitude;
            $scope.obs.altitudeAccuracy = position.coords.altitudeAccuracy;
         });
   }

   getPosition();
  });
