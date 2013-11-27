'use strict';

angular.module('CACMobile')
  .controller('LoadingCtrl', function ($scope, $location, DeviceReady) {
    
    function redirect () {
    	$location.path("/Map");
    }

    if (DeviceReady.ready)
    {
    	redirect();
    }
    else
    {
	    DeviceReady.addEventListener(redirect);
    }


  });
