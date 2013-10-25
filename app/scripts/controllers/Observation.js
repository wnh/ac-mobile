'use strict';

angular.module('CACMobile')
  .controller('ObservationCtrl', function ($scope, uploadService, location) {

$scope.obs = {};
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
         });
   }

   getPosition();
  });
