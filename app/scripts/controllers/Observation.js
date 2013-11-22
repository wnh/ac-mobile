'use strict';

angular.module('CACMobile')
  .controller('ObservationCtrl', function ($scope, ResourceFactory, location, $resource, $modal) {


   //! Position
   /*
   function getPosition () {
      location.getPosition().then(
         function (position){
            $scope.obs.latitude = position.coords.latitude;
            $scope.obs.longitude = position.coords.longitude;
            });
   }

   getPosition();
   //! End Position */


  var fail = function (content) { alert("save failed", content); } //! \todo something useful
  var success = function (content) {alert("save suceeded", content);} //! \todo something useful


  //! Session {
  $scope.session ={email:null, password:null, token:null};
  $scope.saveSession = function() {
    var sessionResource = ResourceFactory.session();
    sessionResource.create($scope.session,
      function(response){
        $scope.session.token = response.token;
      },
      function(response){
        alert(response.data.error);
      }); //! params, data, success, fail
  }
  //! } End Session

  //! Observation {
  $scope.obs = {id:null,token:null, visibility:"public", recorded_at: new Date().toString()};

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
  $scope.photo = {token:null, observation_id:null, comment:null, image:null, id:0};
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


//! Location {
  $scope.location = {id:null, token:null, observation_id:null, latitude:50.9831700, longitude: -118.2023000};

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

//! Load Photo Modal Dialog {
  $scope.SelectPhotoModalCtrl = function ($scope, $modal, $log) {

    $scope.open = function () {

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: ModalCtrl,
        resolve: {
          image: function () {
            return $scope.photo;
          }
        }
      });

      modalInstance.result.then(function (image) {
        $scope.image = image;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  };

  var ModalCtrl = function ($scope, $modalInstance, image) {

    /*
    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };
    */

    $scope.photo = image;

    $scope.ok = function () {
      $modalInstance.close($scope.photo.image);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };
  //! }


/*
  $scope.takePhoto = function(){

    //var form = document.createElement('input');
    //form.type = 'file';

    $scope.photo.file = new FileUpload;
    $scope.photo.file.name = "response";
  };*/

    /*navigator.camera.getPicture(
                      function(response){
                        //$scope.photo.file = new File();
                        $scope.photo.file = document.createElement('file');
                        $scope.photo.file.name = response;
                        //alert(response);
                      },
                      function(response){
                        alert("Error");
                        alert(response);
                      }
                      ,{ quality: 50, destinationType: Camera.DestinationType.FILE_URI });


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

  });



