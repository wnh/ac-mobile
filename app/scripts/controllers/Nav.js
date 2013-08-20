'use strict';

angular.module('CACMobile')
  .controller('NavCtrl', function ($scope, $location, CallVenderApp) {
	    $scope.redirect = function (url){
	    		$location.path(url);			
	    }

      $scope.back = function () {
        window.history.back();
      }
   
     $scope.openMec = function() { CallVenderApp.mec(); }
    
  });
