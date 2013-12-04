'use strict';

angular.module('CACMobile')
  .controller('ObservationListCtrl', function ($scope, State, ResourceFactory) {
   
   $scope.observation_ids = State.getObsIds();
   $scope.observations = [];

   ResourceFactory.observation().query({ids: JSON.stringify($scope.observation_ids)},
    function (response) {
      $scope.observations = response;
    },
    function (response) {
      $scope.observations = response;
    })

   $scope.loadPhoto = function(id) {
    console.log("FOO")
   }
  });
