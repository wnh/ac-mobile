'use strict';

angular.module('CACMobile')
  .factory('DeviceReady', function ($log, platform) {

    var callBacks = [];
    var ready = false;

    //! Iterate over callback list and perform each function {
    function deviceReadyCallback() {

      //! iterate over registered callbacks
      var numItems = callBacks.length;
      console.log("numItems " + numItems);

      for (var i = 0; i < numItems; i++) {
        var func = callBacks.pop();

        if (func != null)
        {
          console.log("Function performed from device ready callback que");
          func();
        }
        else
        {
          console.error("error performing callback");
        }
      }
      //console.assert(callBacks.length == 0, "DeviceReady.js callback not performed list length should be 0");
      ready = true;

    }
    //! }



    if (platform.isWeb() == false) {
      //! When the device is ready perform the deviceReady function
      document.addEventListener('deviceready', deviceReadyCallback, false);

    } else {

      console.log("web detected skipping waiting for device ready");
      deviceReadyCallback();
    }

    return {
      // register a callback to be performed when the device is ready {
      addEventListener: function (func) {

        if(ready === false)
        {
          console.log("Function added to device ready callback que", callBacks.length);
          callBacks.push(func);
        }
        else
        {
          func();
        }

      },
      //! } end addEventListener factory method

      //! return whether or not the device is ready {
      ready: function() {
        return ready;
      }
      //! }

    };
  });
