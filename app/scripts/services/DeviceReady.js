'use strict';

angular.module('CACMobile')
  .factory('DeviceReady', function ($log, platform) {

    var callBacks = [];
    var ready = false;
    var gaPlugin;

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

      var success = function(result) {$log.info("sucess " + result);};
      var error   = function(result) {$log.error("Error " + result);};
      //! Register google analytics plugin
      var ga = function () {
        $log.info("Regsitering google analytics");
        gaPlugin = window.plugins.gaPlugin;
        gaPlugin.init(
                      function (result) {
                                          $log.info("google analytics registered " + result);
                                          gaPlugin.trackPage(success, error, "mobile.cac.ca");
                                          gaPlugin.trackPage(success, error, "index.html");
                                          gaPlugin.trackEvent(success, error, "login", "started", "open", 1);
                                        },
                      function (error){$log.warn("google analytics FAILED to register "+ error ); },
                      "UA-46606603-1", 10);
      };

      callBacks.push(ga);

      //! When the device is ready perform the deviceReady function
      console.log("Device Ready Event Listener");
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
