'use strict';

angular.module('CACMobile')
.controller('ObservationListCtrl', function ($scope, State, ResourceFactory, $modal, $log) {

 $scope.observation_ids = State.getObsIds();
 $scope.observations = [];

  $scope.orderByField = 'id';
  $scope.reverseOrder = false;

   $scope.orderBy = function(field) {
      // If we're selecting the same field, reverse the ordering
      if ($scope.orderByField == field) {
         $scope.reverseOrder = !$scope.reverseOrder;
      } else {
         $scope.orderByField = field;
         $scope.reverseOrder = false;
      }
   }

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
    //$scope.observations = response;
  })
}
else
{
  $log.error("Empty observation_ids array");
}

//begin photo modal

 $scope.loadPhoto = function (id) {
  State.setLoading(true);
  ResourceFactory.photo().get({id: id},
    function (response) {
      $scope.photo = response;
      State.setLoading(false);
      var modalInstance = $modal.open({
        templateUrl: 'modalPhoto.html',
        controller: ModalInstanceCtrl,
        resolve: {
          photo: function () {
            return $scope.photo;
          }
        }
      });
    },
    function (response) {
      console.log("Unable to load photo");
    })
};

var ModalInstanceCtrl = ['$scope', '$modalInstance', 'photo', function ($scope, $modalInstance, photo) {
  $scope.photo = photo;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}];

//end photo modal

//begin comment modal

 $scope.loadComment = function (id) {
    State.setLoading(true);
  ResourceFactory.comment().get({id: id},
    function (response) {
      $scope.comment = response;
      State.setLoading(false);
      var modalInstance = $modal.open({
        templateUrl: 'views/modal/modalComment.html',
        controller: CommentModalInstanceCtrl,
        resolve: {
          comment: function () {
            return $scope.comment;
          }
        }
      });
    },
    function (response) {
      console.log("Unable to load comment");
    })
};

var CommentModalInstanceCtrl = ['$scope', '$modalInstance', 'comment', function ($scope, $modalInstance, comment) {
  $scope.text = comment.text;
  $scope.comment = comment;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}];

// End comment modal



});
