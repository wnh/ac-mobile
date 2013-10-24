'use strict';

angular.module('CACMobile')
  .controller('ObservationCtrl', function ($scope) {


$scope.uploadComplete = function (content, completed) {
    if (completed && content.length > 0) {
      $scope.response = JSON.parse(content); // Presumed content is a json string!
    }
  };

  });
