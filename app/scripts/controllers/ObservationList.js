'use strict';

angular.module('CACMobile')
  .controller('ObservationListCtrl', function ($scope, Observation, ResourceFactory) {
   $scope.observation_ids = Observation.getIds();
   $scope.observations = ResourceFactory.observation().query({ids: JSON.stringify($scope.observation_ids)})
  });
