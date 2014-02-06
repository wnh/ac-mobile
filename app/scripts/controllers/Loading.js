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
    {
    	redirect();
    }
    else
    {
	    DeviceReady.addEventListener(redirect);
    }


  });
