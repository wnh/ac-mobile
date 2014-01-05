'use strict';

angular.module('CACMobile')
  .controller('ObservationviewCtrl', function ($scope, $routeParams, ResourceFactory, State, $log, $modal) {

   $scope.observation_id = $routeParams.id;
   State.setLoading(true);
   $scope.observation = null;
   $scope.photos = []
   $scope.comment = null;

   ResourceFactory.observation().get(
      {
         id: $scope.observation_id
      },
      function (response) {
         $scope.observation = response;
         $log.info("Retrieved observation info");
         loadResources();
      },
      function (response) {
         $log.error("Error retrieving observation: " + response);
         State.setLoading(false);
      }
   )

   function loadResources() {
      var observation = $scope.observation;
      if (observation.photo_id) {
         for (var i=0; i < observation.photo_id.length; i++) {
            ResourceFactory.photo().get(
         {
            id: observation.photo_id[i]
         },
         function (response) {
            $scope.photos.push(response);
            $log.info("Retrieved photo");
         },
         function (response) {
            $log.error("Error retrieving photo: " + response);
         }
         )         
         }        
      }
      if (observation.comment_id) {
         ResourceFactory.comment().get(
         {
            id: observation.comment_id
         },
         function (response) {
            $scope.comment = response;
            $log.info("Retrieved comment");
         },
         function (response) {
            $log.error("Error retrieving comment: " + response);
         }
         )
      }
      State.setLoading(false);
   }

   //begin photo modal

$scope.loadPhoto = function (photo) {
      var modalInstance = $modal.open({
        templateUrl: 'views/modal/modalPhoto.html',
        controller: ModalInstanceCtrl,
        resolve: {
          photo: function () {
            return photo;
          }
        }
      });
};

var ModalInstanceCtrl = ['$scope', '$modalInstance', 'photo', function ($scope, $modalInstance, photo) {
  $scope.photo = photo;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}];

 //begin location modal

 $scope.loadLocation = function (id) {
    State.setLoading(true);
  ResourceFactory.location().get({id: id},
    function (response) {
      $scope.location = response;
      State.setLoading(false);
      var modalInstance = $modal.open({
        templateUrl: 'showLocationModal.html',
        controller: LocationModalInstanceCtrl,
        resolve: {
          location: function () {
            return $scope.location;
          }
        }
      });
    },
    function (response) {
      console.log("Unable to load location");
    })
};

var LocationModalInstanceCtrl = ['$scope', '$modalInstance', 'location', function ($scope, $modalInstance, location) {
  $scope.location = location;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}];

// End location modal

//end photo modal

  });
