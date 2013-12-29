'use strict';

angular.module('CACMobile')
  .controller('ObservationsubmitCtrl',
              ['$scope', 'ResourceFactory', 'location', '$resource', '$modal', '$log','platform', '$routeParams', 'Session', 'ConnectionManager', 'State',
                function ($scope, ResourceFactory, location, $resource, $modal, $log, platform, $routeParams, Session, ConnectionManager, State) {


  $scope.photo_list = State.getSubmissionValue('photo_list');
  $scope.alerts = [];
  $scope.locationName = State.getSubmissionValue('locationName');
  $scope.locationPos  = State.getSubmissionValue('locationPos');
  $scope.positionDesc = State.getSubmissionValue('positionDesc');
  $scope.submitProgress = 0;
  $scope.submitting = false;

  $scope.$watch('locationName', function(){
    State.setSubmissionValue('locationName', $scope.locationName);
  });

  $scope.$watch('locationPos.latitude', function(){
    State.setSubmissionValue('locationPos', $scope.locationPos);
  });

  $scope.$watch('locationPos.longitude', function(){
    State.setSubmissionValue('locationPos', $scope.locationPos);
  });

  $scope.$watch('photo_list', function(){
    State.setSubmissionValue('photo_list', $scope.photo_list);
  });

  $scope.$watch('positionDesc', function(){
    State.setSubmissionValue('positionDesc', $scope.positionDesc);
  });


  $scope.removePhoto = function(index) {
    //! remove 1 element at position index
    $scope.photo_list.splice(index,1)
  }

  function getPosition () {
    location.getPosition().then(
       function (position){
          $scope.locationPos.latitude = position.coords.latitude;
          $scope.locationPos.longitude = position.coords.longitude;
          $scope.positionDesc = "Device Location";
        });
  }

  getPosition();


$scope.cancelSubmit = function (){
  $scope.submitting = false;
  $scope.alerts.push({ type: 'warning', msg: 'Submission canceled !' });
}

$scope.submit = function (){
  $scope.alerts.length = 0;

  if (Session.loggedIn() != true){
    //! \todo make this pop up the sign in window
    $scope.alerts.push({ type: 'error', msg: 'Please sign in before submitting' });
  }

  //! current version only
  if ($scope.photo_list.length == 0){
    $scope.alerts.push({ type: 'error', msg: 'Please select at least one image to upload' });
  }

  if($scope.locationName.length == 0){
    $scope.alerts.push({ type: 'error', msg: 'Set Location Name' });
  }

  if($scope.positionDesc == "Unknown"){
    $scope.alerts.push({ type: 'error', msg: 'Set Position' });
  }

  if(ConnectionManager.isOnline() == false){
    $scope.alerts.push({ type: 'error', msg: 'You must be online to submit an Observation' });
  }

   //no alerts then submit observation
  if($scope.alerts.length == 0){

    var submitObs = function (){

      if ($scope.submitting == true)
      {
        var obs = {'id':null,'token':Session.token(), 'visibility':"public", 'recorded_at': new Date().toString()};
        $log.info("Submitting obs = "+ obs);

        ResourceFactory.observation().create(obs,
          function(response)
          {
            obs.id = response.id;
            $log.info('Observation Submitted successfully obsId= ' + response.id);
            progressSubmissionStatus("Observation Created");
            submitLocation(obs.id);
            submitPhoto(obs.id);
          },
          function(response){
            $scope.submitting = false;
            $log.error("error submitting observation");
            $scope.alerts.push({ type: 'error', msg: 'Error Uploading Observation' });
          });
      }
    };

    var submitPhoto = function(obsId){
      var photo = null;
      if ($scope.submitting == true)
      {

        for (var i=0; i < $scope.photo_list.length; ++i)
        {
          photo = {'id':null,'token':Session.token(), 'observation_id':obsId, 'comment':$scope.photo_list[i].comment, 'image':$scope.photo_list[i].image};
          $log.info("Submitting photo = "+ photo);

          ResourceFactory.photo().create(photo,
              function(response){
                //$scope.photo_list[i].id = response.id;
                progressSubmissionStatus("Photo Submitted");
                $log.info('Photo Submitted Successfully ' + response);
              },
              function(response){
                $scope.submitting = false;
                $log.error("error submitting photo");
                $scope.alerts.push({ type: 'error', msg: 'Error Uploading Photo' });
              });
        }
      }
    }

    var submitLocation = function(obsId){
       if($scope.submitting == true)
       {

         var location = {'id':null, 'token':Session.token(), 'observation_id':obsId, 'latitude':$scope.locationPos.latitude, 'longitude': $scope.locationPos.longitude, 'name': $scope.locationName};
         $log.info("Submitting location = "+ location);

         ResourceFactory.location().create(location,
              function(response){
                location.id = response.id;
                progressSubmissionStatus("Location Submitted");
                $log.info('Location Submitted Sucesfully locationId' + response.id);
              },
              function(response){
                $scope.submitting = false;
                $log.error("error submitting photo");
                $scope.alerts.push({ type: 'error', msg: 'Error Uploading Photo' });
              });
       }
    }

    var progressSubmissionStatus = function(msg){
      $scope.submitProgress += 30;
      $scope.alerts.push({ type: 'success', msg: msg});

      if ($scope.submitProgress >= 99){
        $scope.submitting = false;
        $scope.photo_list.length = 0;
        $scope.locationName = "";
        $scope.alerts.length = 0;
        $scope.alerts.push({ type: 'success', msg: 'Submission Successful! Thank-you for contributing to public safety' });
      }
    }

    $scope.submitProgress = 10;
    $scope.submitting = true;
    submitObs();

  }

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
        $scope.locationPos.latitude = location.latitude;
        $scope.locationPos.longitude = location.longitude;
        $scope.positionDesc = "User Defined";
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    }

}];

var SetLocationModalCtrl = ['$scope', '$modalInstance', 'location', function ($scope, $modalInstance, location) {
  $scope.location = location;
  $scope.ok = function () {
    $modalInstance.close({latitude: $scope.location.latitude, longitude: $scope.location.longitude});
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
        var ob = { comment:"", image:null, id:null };
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
              window.resolveLocalFileSystemURI(response,
                                               function (entry){
                                                  photo = entry.fullPath;
                                                  $modalInstance.close(photo);
                                                },
                                               function (evt){
                                                $log.error("error getting image " + evt.code);
                                              });

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
              sourceType:      Camera.PictureSourceType.CAMERA,
              saveToPhotoAlbum: true});
        }
        else
        {
          $log.warn('Web detected Camera unavailable default image used');
          photo = 'img/CAC_Logo.png';
          $modalInstance.close(photo);
        }
    };

    $scope.library = function() {
      if (platform.isMobile())
      {
        getImage({ quality: 45,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType:      Camera.PictureSourceType.PHOTOLIBRARY,
              mediaType:       Camera.MediaType.PICTURE});
      }
      else
      {
        $log.warn('Web detected Camera unavailable default image used');
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
