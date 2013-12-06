'use strict';

angular.module('CACMobile')
  .controller('ObservationsubmitCtrl',
              ['$scope', 'ResourceFactory', 'location', '$resource', '$modal', '$log','platform', '$routeParams',
                function ($scope, ResourceFactory, location, $resource, $modal, $log, platform, $routeParams) {

  $scope.debug = $routeParams.debug;
  $scope.web = platform.isWeb();
  $scope.session = {email:null, password:null, token:null};
  $scope.obs = {id:null,token:null, visibility:"public", recorded_at: new Date().toString()};
  $scope.photo = {token:null, observation_id:null, comment:null, image:null, id:0};
  $scope.location = {id:null, token:null, observation_id:null, latitude:50.9831700, longitude: -118.2023000};

 //! Position

   function getPosition () {
      location.getPosition().then(
         function (position){
            $scope.obs.latitude = position.coords.latitude;
            $scope.obs.longitude = position.coords.longitude;
            });
   }

   getPosition();
   //! End Position */


  //! Observation {

  $scope.saveObs = function(token) {

    $scope.obs.token = token;

    var obsResource = ResourceFactory.observation();
    obsResource.create($scope.obs,
      function(response)
      {
        $scope.obs.id = response.id;
      },
      function(response){
        alert(response.data.error);
      }); //! params, data, success, fail
  };
  //! } End Observation


  //! Photo {

  $scope.savePhoto = function(token, obs_id) {

    $scope.photo.observation_id = obs_id;
    $scope.photo.token = token;

    var photoResource = ResourceFactory.photo();
    photoResource.create($scope.photo,
      function(response){
        $scope.photo.id = response.id;
        alert(response.id);
      });
  }
  //! }

//! Load Photo Modal Dialog {
  $scope.SelectPhotoModalCtrl = ['$scope', function ($scope) {

    $scope.open = function () {

      var modalInstance = $modal.open({
        templateUrl: 'selectPhoto_modal.html',
        controller: ModalCtrl,
        resolve: {
          image: function () {
            return $scope.photo;
          }
        }
      });

      modalInstance.result.then(function (image) {
        $scope.photo = image;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }];


  var ModalCtrl = ['$scope', '$modalInstance', 'image', function ($scope, $modalInstance, image) {

    $scope.photo = image;
    //$scope.photo = {image:null};

    var getImage = function (source) {
        $log.info(source)

        if (platform.isMobile())
        {
          navigator.camera.getPicture(
            function(response){
              alert(response);
              $scope.photo.image = response;
            },
            function(response){
              $log.error("error getting image " + response);
            },
            source);
        }
        else
        {
          $log.error("attempted to get image when the platform is web based");
        }

    }

    $scope.camera = function () {
            getImage({ quality: 45,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType:      Camera.PictureSourceType.CAMERA});
    };

    $scope.library = function() {
      getImage({ quality: 45,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType:      Camera.PictureSourceType.PHOTOLIBRARY});
    };

    $scope.ok = function () {
      $modalInstance.close($scope.photo.image);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }];
  //! }

//! Load Location Modal Dialog

 $scope.setLocation = function () {
      var modalInstance = $modal.open({
        templateUrl: 'modalLocation.html',
        controller: setLocationCtrl,
        resolve: {
          location: function () {
            return {latitude: $scope.location.latitude, longitude: $scope.location.longitude};
          }
        }
      });
      modalInstance.result.then(function (location) {
        $scope.location = location;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
};

var setLocationCtrl = ['$scope', '$modalInstance', 'location', function ($scope, $modalInstance, location) {
  $scope.location = location;
  $scope.ok = function () {
    $modalInstance.close($scope.location);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}];
//! End Location Modal Dialog

//! Location {


  $scope.saveLocation = function(token, obs_id) {

    $scope.location.token = token;
    $scope.location.observation_id = obs_id;

    var locResource = ResourceFactory.location();
    locResource.create($scope.obs,
      function(response){
        $scope.location.id = response.id;
      },
      function(response){
        alert(response.data.error);
      }); //! params, data, success, fail
  };
  //! } End Observation

/*

  //$scope.saveObs = function() {
    var obs = new $resource('http://obsnet.herokuapp.com/observation', {},{ test: { method: 'GET' }});
    obs.token = $scope.obs.token;
    obs.recorded_at = $scope.obs.recorded_at;
    obs.visibility = $scope.visibility;
    obs.save(uploadComplete);
   //uploadService.send($scope.obs,$scope)
  //};

  // $scope.latitude = 50.9831700;
  // $scope.longitude = -118.2023000;


/*   var uploadComplete = function (content) {
      //! \todo ensure json parse success before setting response object
      $scope.response = JSON.parse(content); // Presumed content is a json string!
  };*/



  }]);
