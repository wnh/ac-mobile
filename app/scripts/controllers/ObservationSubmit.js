'use strict';

angular.module('CACMobile')
  .controller('ObservationsubmitCtrl',
              ['$scope', 'ResourceFactory', 'location', '$resource', '$modal', '$log','platform', '$routeParams',
                function ($scope, ResourceFactory, location, $resource, $modal, $log, platform, $routeParams) {


  $scope.photo_list = new Array() ;

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
        var ob = { comment:null, image:null };
        ob.image = photo;
        $scope.photo_list.push(ob);
        var tep = 1;
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
      }
    };

    $scope.ok = function () {
      if (photo != null)
        $modalInstance.close(photo);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }];
  //! }

  }]);
