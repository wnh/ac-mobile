'use strict';

angular.module('CACMobile')
  .controller('ObservationsubmitCtrl',
              ['$scope', 'ResourceFactory', 'location', '$resource', '$location', '$modal', '$log','platform', '$routeParams', 'Session', 'ConnectionManager', 'State','$anchorScroll',
                function ($scope, ResourceFactory, location, $resource, $location, $modal, $log, platform, $routeParams, Session, ConnectionManager, State, $anchorScroll) {


  $scope.photo_list = State.getSubmissionValue('photo_list');
  $scope.alerts = [];
  $scope.locationName = State.getSubmissionValue('locationName');
  $scope.locationPos  = State.getSubmissionValue('locationPos');
  $scope.positionDesc = State.getSubmissionValue('positionDesc');
  $scope.description  = State.getSubmissionValue('comment');
  $scope.submitProgress = 0;
  $scope.submitting = false;

  $scope.$watch('description', function(){
    State.setSubmissionValue('comment', $scope.description );
  })

  $scope.$watch('locationName', function(){
    State.setSubmissionValue('locationName', $scope.locationName);
  });

  $scope.$watch('locationPos.latitude', function(){
    State.setSubmissionValue('locationPos', $scope.locationPos);
    State.setSubmissionValue('positionDesc', $scope.positionDesc);
  });

  $scope.$watch('locationPos.longitude', function(){
    State.setSubmissionValue('locationPos', $scope.locationPos);
    State.setSubmissionValue('positionDesc', $scope.positionDesc);
  });

  $scope.$watch('photo_list', function(){
    State.setSubmissionValue('photo_list', $scope.photo_list);
  });

  $scope.$watch('positionDesc', function(){
    State.setSubmissionValue('positionDesc', $scope.positionDesc);
  });


  $scope.removePhoto = function(index) {
    //! remove 1 element at position index
    $scope.photo_list.splice(index,1);
    $log.info("Photo removed array length=", $scope.photo_list.length);
  }

  function scrollToErrors() {
    console.log("going to top of page")
    $location.hash('top');
    $anchorScroll();
    $location.hash('');
  }

  function getPosition () {
    location.getPosition().then(
       function (position){
          $scope.locationPos.latitude = position.coords.latitude;
          $scope.locationPos.longitude = position.coords.longitude;
          $scope.positionDesc = "Device Location";
        });
  }


if ($scope.positionDesc == "Unknown"){
  getPosition();
}

$scope.cancelSubmit = function (){
  $scope.submitting = false;
  $scope.alerts.push({ type: 'warning', msg: 'Submission canceled !' });
}

$scope.submit = function (){
  $scope.alerts.length = 0;
  var comment = ( $scope.description == null || $scope.description == "" ? false : true );
  var steps = 2 + $scope.photo_list.length + ( comment ? 1 : 0 ) ;
  var stepSize = 100 / steps;

  if (Session.loggedIn() != true){
    //! \todo make this pop up the sign in window
    $scope.alerts.push({ type: 'error', msg: 'Please <a ng-click="openSignInModal()">sign in</a> before submitting' });
  }

  //! current version only
  if ($scope.photo_list.length == 0){
    $scope.alerts.push({ type: 'error', msg: 'Please select at least one image to upload' });
  }

  if ($scope.locationName.length == 0){
    $scope.alerts.push({ type: 'error', msg: 'Set Location Name' });
  }

  if ($scope.positionDesc == "Unknown"){
    $scope.alerts.push({ type: 'error', msg: 'Set Position' });
  }

  if (ConnectionManager.isOnline() == false){
    $scope.alerts.push({ type: 'error', msg: 'You must be online to submit an Observation' });
  }

   //no alerts then submit observation
  if ($scope.alerts.length == 0){


    var submitObs = function (){

      if ($scope.submitting == true)
      {
        var obs = {'id':null,'token':Session.token(), 'visibility':"public", 'recorded_at': new Date().toString()};
        $log.info("Submitting obs = ", obs);

        ResourceFactory.observation().create(obs,
          function(response)
          {
            obs.id = response.id;
            $log.info('Observation Submitted successfully obsId= ' + response.id);
            progressSubmissionStatus("Observation Created");
            submitPhoto(obs.id, 0);
          },
          function(response){
            if (response.status == 401) {
              Session.destroy();
              $scope.alerts.push({ type: 'error', msg: 'Your session has expired. Please <a ng-click="openSignInModal()">sign in</a> again'})
            } else {
              $scope.alerts.push({ type: 'error', msg: 'Error Uploading Observation' });
            }
            $scope.submitting = false;
            $log.error("error submitting observation");
            scrollToErrors();
          });
      }
    }

    var submitPhoto = function(obsId, i){
      var photo = null;
      if ($scope.submitting == true)
      {

          photo = {'id':null,'token':Session.token(), 'observation_id':obsId, 'comment':$scope.photo_list[i].comment, 'image':$scope.photo_list[i].image};
          $log.info("Submitting photo = ", photo);

          ResourceFactory.photo().create(photo,
              function(response){
                i ++;

                progressSubmissionStatus("Photo " + i + " Submitted");
                $log.info('Photo ' + i + ' Submitted Successfully ' + response);

                if (i < $scope.photo_list.length){
                  submitPhoto(obsId, i);
                }
                else if (i == $scope.photo_list.length){
                  submitLocation(obsId);
                }
                else
                {
                  $log.error("Index counter increased beyond number of photos ! ", i , $scope.photo_list.length);
                }

              },
              function(response){
                $scope.submitting = false;
                $log.error("error submitting photo", response);
                $scope.alerts.push({ type: 'error', msg: 'Error Uploading Photo ' + response });
              });

      }
    }

    var submitLocation = function(obsId){
       if($scope.submitting == true)
       {

         var location = {'token':Session.token(), 'observation_id':obsId, 'latitude':$scope.locationPos.latitude, 'longitude': $scope.locationPos.longitude, 'name': $scope.locationName};
         var locId = null;
         $log.info("Submitting location = ", location);

         ResourceFactory.location().create(location,
              function(response){
                locId = response.id;
                progressSubmissionStatus("Location Submitted");
                $log.info('Location Submitted Sucesfully locationId' + response.id);

                if (comment == true){
                  submitComment(obsId);
                }

              },
              function(response){
                $scope.submitting = false;
                $log.error("error submitting location");
                $scope.alerts.push({ type: 'error', msg: 'Error submitting location'});
              });
       }
    }

    var submitComment = function(obsId){
      if($scope.submitting == true)
       {

         var comment = {'id':null, 'token':Session.token(), 'observation_id':obsId, 'text': $scope.description};
         $log.info("Submitting obs comment ");

         ResourceFactory.comment().create(comment,
              function(response){
                comment.id = response.id;
                progressSubmissionStatus("Comment Submitted");
                $log.info('Comment Submitted Successfully id' + response.id);
              },
              function(response){
                $scope.submitting = false;
                $log.error("error submitting comment");
                $scope.alerts.push({ type: 'error', msg: 'Error Uploading Comment' });
              });
       }
    }

    var progressSubmissionStatus = function(msg){
      $scope.submitProgress += stepSize;
      $scope.alerts.push({ type: 'success', msg: msg});

      if ($scope.submitProgress >= 99){
        $scope.submitting = false;
        $scope.photo_list.length = 0;
        $scope.submitProgress >= 0;
        $scope.locationName = "";
        $scope.description = "";
        $scope.alerts.length = 0;
        $scope.alerts.push({ type: 'success', msg: 'Submission Successful! Thank-you for contributing to public safety' });
      }
    }

    $scope.submitProgress = 10;
    $scope.submitting = true;
    submitObs();

  } else {
    scrollToErrors();
  }
}


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
        $scope.positionDesc = "User Defined";
        $log.info($scope.locationPos)
        $scope.locationPos.latitude = location.latitude;
        $scope.locationPos.longitude = location.longitude;
        $log.info($scope.locationPos)
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

    $scope.open = function () {

      var modalInstance = $modal.open({
        templateUrl: 'loadPhoto_modal.html',
        controller: LoadPhotoModalCtrl
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


  var LoadPhotoModalCtrl = ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    var photo = null;
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
              targetHeight: 1024,
              targetWidth: 1024,
              saveToPhotoAlbum: true,
              correctOrientation:true });
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
        getImage({
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType:      Camera.PictureSourceType.PHOTOLIBRARY,
              mediaType:       Camera.MediaType.PICTURE
            });
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
