'use strict';

angular.module('CACMobile')
  .controller('ObservationListCtrl', function ($scope, State, ResourceFactory, $modal) {
   
   $scope.observation_ids = State.getObsIds();
   $scope.observations = [];

   ResourceFactory.observation().query({ids: JSON.stringify($scope.observation_ids)},
    function (response) {
      $scope.observations = response;
    },
    function (response) {
      $scope.observations = response;
    })


    $scope.loadPhoto = function (id) {
      console.log(id);
      ResourceFactory.photo().test({id: id},
        function (response) {
          $scope.photo = response;
          console.log(response);
        },
        function (response) {
          console.log("Unable to load photo");
        })
      var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        photo: function () {
          return $scope.photo;
        }
      }
    });

  };

var ModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
  });
