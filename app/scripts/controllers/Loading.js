'use strict';

angular.module('CACMobile')
  .controller('LoadingCtrl', function ($scope, $location, ConnectionManager, DeviceReady) {

    function redirect () {

      if(ConnectionManager.isOnline() == true)
      {
        $location.path("/Map");
      }
      else
      {
        $location.path("/RegionList");
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
