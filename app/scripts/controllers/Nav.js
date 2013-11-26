'use strict';

angular.module('CACMobile')
  .controller('NavCtrl', function ($scope, $location, CallVenderApp,TOU) {
	    
       //! redirect to page within the application
       $scope.redirect = function (url){
	    		$location.path(url);			
	    }

      $scope.hideBack = function() {
        var hide = false;
        if (TOU.accepted() == false) {
          hide = true;
        }
        var noBackRoutes = ["/Map","/region-list","/"];
        if (jQuery.inArray($location.path(),noBackRoutes) > -1) {
          hide = true
        }
        return hide;
      }

      $scope.back = function () {
        window.history.back();
      }

      //! open a url in the web browser
      $scope.openUrl = function(url){
         window.open(url,'_system','location=no');
      }
   
      $scope.openMec = function() { 
         CallVenderApp.mec(); 
      }

      $scope.acceptedTOU = TOU.accepted();

      $scope.acceptTOU = function() {
        TOU.accept();
        $location.path('/');
      }

      $scope.$watch(function () { return TOU.accepted(); },
      function() {
          $scope.acceptedTOU = TOU.accepted();
        },true)

      // Assume Android, and check for iPhone/iPod/iPad

      $scope.company = "Google"
      $scope.appstore = "Google Play"
      $scope.os = "Android"

      if(navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
        $scope.company = "Apple"
        $scope.appstore = "App Store"
        $scope.os = "iOS"
      }

    
  });
