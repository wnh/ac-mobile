'use strict';

angular.module('CACMobile')
  .controller('LoadingCtrl', function ($scope, $location, ConnectionManager, DeviceReady, $rootScope) {

    function redirect () {

      if(ConnectionManager.isOnline() == true)
      {
        $rootScope.$apply($location.path("/Map"));
      }
      else
      {
        $rootScope.$apply($location.path("/region-list"));
      }

    }

    if (DeviceReady.ready() == true)
    //Not using the redirect() function above because we only want to do $rootScope.apply for the callback
    {
    	if(ConnectionManager.isOnline() == true)
      {
        $location.path("/Map");
      }
      else
      {
        $location.path("/region-list");
      }
    }
    else
    {
	    DeviceReady.addEventListener(redirect);
    }


  });
