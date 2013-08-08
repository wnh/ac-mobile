'use strict';

angular.module('CACMobile')
  .factory('DeviceReady', function () {
 
    var callBacks = [];
    var ready = false;

    //! Iterate over callback list and perform each function {
    function deviceReady (argument) {
      ready = true;
      for (var i = 0; i < callBacks.length; i++) {
            console.log("Function performed from device ready callback que");
            var func = callBacks.pop();
            func ? func() : console.assert(func != NULL, "null function pointer");
          }
    }
    //! }

    //! When the device is ready perform the deviceReady function {
    document.addEventListener('deviceready', deviceReady, false); 

    return {
      // register a callback to be performed when the device is ready {
      addEventListener: function (func) {
        console.log("Function added to device ready callback que");
        callBacks.push(func);
      },
      //! } end addEventListener factory method

      //! return whether or not the device is ready {
      ready: function() {
        return ready;
      }
      //! }

    };
  });
