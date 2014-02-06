'use strict';
angular.module('CACMobile')
  .controller('NavCtrl', function ($scope, $location, $log, CallVenderApp, ConnectionManager, TOU, Session, $modal, State, ConnectionManager) {

      $scope.acceptedTOU = TOU.accepted();

      $scope.acceptTOU = function() {
        TOU.accept();
        if(ConnectionManager.isOnline() == true)
          {
            $location.path("/Map");
          }
          else
          {
            $location.path("/region-list");
          }
      }

    $scope.loading = State.getLoading();

    $scope.$watch(function () { return State.getLoading(); },
         function(oldval,newval) {
               $scope.loading = State.getLoading();
         },true);

    $scope.token = Session.token();
    $scope.signedIn = false;

    var checkSignIn = function(){
      $scope.signedIn = Session.loggedIn();
    };
    checkSignIn();

    $scope.online = function () {
      return ConnectionManager.isOnline();
    }

    $scope.offlineDetails = function (){
      alert("No data connection available. Functionality will be restricted.");
    }

    $scope.signOut = function(){
      var confirmRemove = confirm('Are you sure you want to log out?');
      if (confirmRemove) {
        Session.destroy();
        checkSignIn();
      } else {
        $log.info("Sign out clicked but not confirmed")
      }

    }

    //! Sign in Modal {
    $scope.openSignInModal = function () {
      if ($scope.acceptedTOU == true) {
        var modalInstance = $modal.open({
          templateUrl: 'signIn_modal.html',
          controller: SignInModalCtrl,
        });
      } else {
        $log.info("Tried to open sign in modal without accepting TOU")
      }
    }

    var SignInModalCtrl = [ '$scope', '$modalInstance', '$location', 'Session', function ($scope, $modalInstance, $location, Session) {

      $scope.plainText = "password" ;
      $scope.sessionParams = {'email':null, 'password':null, 'token':null};
      $scope.alert = null;

      var signInSuccess = function(){
        $modalInstance.close();
        checkSignIn();
      };

      var signInFail = function(error){
        $log.error(error);
        checkSignIn();
        $scope.alert = { type: 'error', msg: error };
      };

      $scope.ok = function () {
        Session.logIn($scope.sessionParams, signInSuccess, signInFail);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }];
    //! } End Sign in Modal

    // Begin obcChoice modal code
    $scope.loadObsChoice = function () {
      if ($scope.acceptedTOU == true) {
        var modalInstance = $modal.open({
          templateUrl: 'modalObsChoice.html',
          controller: obsChoiceCtrl,
          resolve: {
            online: function () {
              return $scope.online();
            }
          }
        });
      } else {
        $log.info("Tried to open obs choice modal before accepting TOU")
      }

    };

    var obsChoiceCtrl = ['$scope', '$modalInstance', '$location', 'online', function ($scope, $modalInstance, $location, online) {
      $scope.online = online;
      $scope.redirect = function (url){
        $location.path(url);
        $modalInstance.dismiss('redirect');
      }
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }];
    // End obcChoice modal code

       //! redirect to page within the application
       $scope.redirect = function (url){
	    		$location.path(url);
	    }

      $scope.hideBack = function() {
        var hide = false;
        if (TOU.accepted() == false) {
          hide = true;
        }
        var noBackRoutes = ["/Map","/region-list","/","/ObservationSubmit","/ObservationViewMap"];
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

      $scope.$watch(function () { return TOU.accepted(); },
      function() {
          $scope.acceptedTOU = TOU.accepted();
        },true)

      $scope.$watch(function () { return Session.loggedIn(); },
      function() {
          checkSignIn();
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
