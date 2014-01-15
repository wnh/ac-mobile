'use strict';

angular.module('CACMobile')
.controller('ObservationListCtrl', function ($scope, State, ResourceFactory, $modal, $log, $location) {

 $scope.observation_ids = State.getObsIds();
 $scope.observations = [];

 $scope.orderByField = State.getOrderByField();
 $scope.reverseOrder = State.getReverseOrder();

 $scope.toJsDate = function(str){
    if(!str)return null;
    return new Date(str);
  }

 $scope.orderBy = function(field) {
      // If we're selecting the same field, reverse the ordering
      if ($scope.orderByField == field) {
       $scope.reverseOrder = !$scope.reverseOrder;
     } else {
       $scope.orderByField = field;
       $scope.reverseOrder = false;
     }

     State.setOrderByField($scope.orderByField);
     State.setReverseOrder($scope.reverseOrder);

   }

   $scope.loadObservation = function(id) {
    $location.path("/ObservationViewDetail/"+id);
   }

   function loadObservations() {
    if ($scope.observation_ids.length > 0)
    {
      State.setLoading(true);
      ResourceFactory.observation().query({ids: JSON.stringify($scope.observation_ids)},
        function (response) {
          $scope.observations = response;
          $log.info("Retrieved observation list");
          State.setLoading(false);
        },
        function (response) {
          $log.error("Error retrieving observations: " + response);
          State.setLoading(false);
  })
    }
    else
    {
      $log.error("Empty observation_ids array");
      $scope.observations = [];
    }
  }
  loadObservations();

  $scope.$watch(function () { return State.getObsIds(); },
    function() {
      if (State.getObsIds() != $scope.observation_ids) {
        $scope.observation_ids = State.getObsIds();
        $scope.observations = [];
        loadObservations();
      }
    },true)

});
