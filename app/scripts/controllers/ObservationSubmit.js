'use strict';

angular.module('CACMobile')
  .controller('ObservationsubmitCtrl',
              ['$scope', 'ResourceFactory', 'location', '$resource', '$modal', '$log','platform', '$routeParams', 'Session',
                function ($scope, ResourceFactory, location, $resource, $modal, $log, platform, $routeParams, Session) {


  $scope.photo_list = [];
  $scope.alerts = [];
  $scope.locationName = "";
  $scope.locationPos = {latitude:0.0, longitude: 0.0};//{latitude:50.9831700, longitude: -118.2023000};
  $scope.positionDesc = "";


  function getPosition () {
    location.getPosition().then(
       function (position){
          $scope.locationPos.latitude = position.coords.latitude;
          $scope.locationPos.longitude = position.coords.longitude;
          $scope.positionDesc = "Current Position";
        });
  }

  getPosition();

   /*
    { type: 'error', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];*/

$scope.submit = function (){
  $scope.alerts.length = 0;

  if (Session.loggedIn() != true){
    //! \todo make this pop up the sign in window
    $scope.alerts.push({ type: 'error', msg: 'Please Sign In Before Submitting' });
  }

  //! \todo verify this !
  //! current version only
  if ($scope.photo_list.length == 0){
    $scope.alerts.push({ type: 'error', msg: 'Please select at least one image to upload' });
  }

  if($scope.locationName.length == 0){
    $scope.alerts.push({ type: 'error', msg: 'Set Location Name' });
  }

   //no alerts then submit observation
  if($scope.alerts.length == 0){

    var submitObs = function (){
      var obs = {'id':null,'token':Session.token(), 'visibility':"public", 'recorded_at': new Date().toString()};
      $log.info("Submitting obs = "+ obs);

      ResourceFactory.observation().create(obs,
        function(response)
        {
          obs.id = response.id;
          $log.info('Observation Submitted Sucesfully ObsId=' + response.id);
          submitPhoto(obs.id);
          submitLocation(obs.id);

        },
        function(response){
          $log.error("error submitting observation");
          $scope.alerts.push({ type: 'error', msg: 'Error Uploading Observation' });
        });
    };

    var submitPhoto = function(obsId){
      var photo = null;
      for (var i=0; i < $scope.photo_list.length; ++i)
      {
        photo = {'id':null,'token':Session.token(), 'observation_id':obsId, 'comment':$scope.photo_list[i].comment, 'image':$scope.photo_list[i].image};
        $log.info("Submitting photo = "+ photo);

        ResourceFactory.photo().create(photo,
            function(response){
              photoList[i].id = response.id;
              $log.info('Photo Submitted Sucesfully ' + response);
            },
            function(response){
              $log.error("error submitting photo");
              $scope.alerts.push({ type: 'error', msg: 'Error Uploading Photo' });
            });
      }
    }

    var submitLocation = function(obsId){
       var location = {'id':null, 'token':Session.token(), 'observation_id':obsId, 'latitude':$scope.locationPos.latitude, 'longitude': $scope.locationPos.longitude, 'name': $scope.locationName};
       $log.info("Submitting location = "+ location);

       ResourceFactory.location().create(location,
            function(response){
              location.id = response.id;
              $log.info('Location Submitted Sucesfully locationId' + response.id);
            },
            function(response){
              $log.error("error submitting photo");
              $scope.alerts.push({ type: 'error', msg: 'Error Uploading Photo' });
            });
    }

    submitObs();

  }

  //! \todo should we check location comment ?

};

 //! Load Location Modal Dialog
 $scope.ModifyPositionModal = ['$scope', function ($scope) {

    $scope.open = function () {

      var modalInstance = $modal.open({
        templateUrl: 'modifyPosition_modal.html',
        controller: SetLocationModalCtrl,
        resolve: {
          location: function () {
            return {latitude: $scope.locationPos.latitude, longitude: $scope.locationPos.longitude};
          }
        }
      });

      modalInstance.result.then(function (location) {
        $scope.locationPos = location;
        $scope.positionDesc = "Custom";
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    }

}];

var SetLocationModalCtrl = ['$scope', '$modalInstance', 'location', function ($scope, $modalInstance, location) {
  $scope.location = location;
  $scope.ok = function () {
    $modalInstance.close($scope.location);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}];
//! End Location Modal Dialog


//! Load Photo Modal Dialog {
  $scope.LoadPhotoModal = ['$scope', function ($scope) {

    var photo = null;

    $scope.open = function () {

      var modalInstance = $modal.open({
        templateUrl: 'loadPhoto_modal.html',
        controller: LoadPhotoModalCtrl,
        resolve: {
          image: function () {
            return photo;
          }
        }
      });

      modalInstance.result.then(function (photo) {
        var ob = { comment:null, image:null, id:null };
        ob.image = photo;
        $scope.photo_list.push(ob);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

  }];


  var LoadPhotoModalCtrl = ['$scope', '$modalInstance', 'image', function ($scope, $modalInstance, photo) {

    var getImage = function (source) {
        $log.info(source)

        if (platform.isMobile())
        {
          navigator.camera.getPicture(
            function(response){
              photo = response;
              $modalInstance.close(photo);
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
        if (platform.isMobile())
        {
          getImage({ quality: 45,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType:      Camera.PictureSourceType.CAMERA});
        }
        else
        {
          $log.info('Web detected Camera unavailable default image used');
          photo = 'img/CAC_Logo.png';
          $modalInstance.close(photo);
        }
    };

    $scope.library = function() {
      if (platform.isMobile())
      {
        getImage({ quality: 45,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType:      Camera.PictureSourceType.PHOTOLIBRARY});
      }
      else
      {
        $log.info('Web detected Camera unavailable default image used');
        photo = 'img/CAC_Logo.png';
        $modalInstance.close(photo);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }];
  //! }

  }]);
