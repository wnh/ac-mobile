'use strict';

angular.module('CACMobile')
  .controller('NavCtrl', function ($scope, $location, CallVenderApp) {
	    
       //! redirect to page within the application
       $scope.redirect = function (url){
	    		$location.path(url);			
	    }

      $scope.back = function () {
        window.history.back();
      }

      //! open a url in the web browser
      $scope.openUrl = function(url){
         window.open(url,'_blank','location=no');
      }
   
      $scope.openMec = function() { 
         CallVenderApp.mec(); 
      }
    
  });
