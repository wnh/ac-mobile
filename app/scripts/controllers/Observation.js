'use strict';

angular.module('CACMobile')
  .controller('ObservationCtrl', function ($scope, uploadService) {

$scope.obs = {};
$scope.uploadComplete = function (content) {
      $scope.response = JSON.parse(content); // Presumed content is a json string!
  };

  $scope.saveObs = function() {
   uploadService.send($scope.obs,$scope)
  }

  });
