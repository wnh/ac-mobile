'use strict';

angular.module('CACMobile')
  .controller('ObservationListCtrl', function ($scope, Observation, ResourceFactory) {
   $scope.observation_ids = Observation.getIds();
   $scope.observations = ResourceFactory.observation().query({ids: JSON.stringify($scope.observation_ids)})
  
  $scope.photoTest = function(foo) {return foo}
   $scope.photoLinks = function(ids) {
      console.log(ids);
      var ret = ""
      for (var i=0; i<ids.length; i++)
      {
         ret += "<a href='#' ng-click='loadPhoto(" + ids[i] + ")>Photo</a>";
      }
      return ret;
   }
  });
