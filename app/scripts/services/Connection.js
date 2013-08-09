'use strict';

angular.module('CACMobile')
  .factory('ConnectionManager', function($rootScope, DeviceReady) {
    

    //! Handle Change of connection device state { 
    var deviceReadyCallBacks = [];
    var onlineCallbacks = [];
    var offlineCallbacks = [];

    function performCallBack (cb) {
            
      for (var i = 0; i < cb.length; i++) {
        var func = cb.pop();
        func ? func() : console.assert(func != NULL, "null function pointer");
      }

    }

    function performOnlineCallback () {
      alert("Online");
      performCallBack(onlineCallbacks);
      $rootScope.apply();
    }

    function performOfflineCallback () {
      alert("Offline");
      performCallBack(offlineCallbacks);
      $rootScope.apply();
    }

    function performDeviceReadyCallback () {
      document.addEventListener("online", performOnlineCallback, false);
      document.addEventListener("offline", performOfflineCallback, false);

      console.log("Connection Device Ready");

      performCallBack(deviceReadyCallBacks);
    }

    DeviceReady.addEventListener(performDeviceReadyCallback);    
    //! }


    //! {

    //! Connection constants not defined in web
    //var conType = (typeof(Connection) == undefined ? {UNKNOWN:0, ETHERNET:1, WIFI:2, CELL_2G:3, CELL_3G:4, CELL_4G:5, CELL: 6, NONE:7} : Connection );
    /*var conType =  {UNKNOWN:0, ETHERNET:1, WIFI:2, CELL_2G:3, CELL_3G:4, CELL_4G:5, CELL: 6, NONE:7}; 

    var states = {};
    states[conType.UNKNOWN]  = 'Unknown connection';
    states[conType.ETHERNET] = 'Ethernet connection';
    states[conType.WIFI]     = 'WiFi connection';
    states[conType.CELL_2G]  = 'Cell 2G connection';
    states[conType.CELL_3G]  = 'Cell 3G connection';
    states[conType.CELL_4G]  = 'Cell 4G connection';
    states[conType.CELL]     = 'Cell generic connection';
    states[conType.NONE]     = 'No network connection';*/

    function connectionState() {
        var connection_   = navigator.connection  || {'type':'unknown'};
        var networkState_ = connection_.type;
        return networkState_;
    }

    function online () {
        var connection_   = navigator.connection  || {'type':'unknown'};
        var networkState_ = connection_.type;
        return ((networkState_ !=  'none') && (networkState_ !=  'unknown') )  
    }
    //! }

    //! Check connection state and if state is already met then perform action
    //! Regsiter callback so that on appropriate state change action is performed
    return {

      online: function (funcPtr) {

        function onlineHandler() {
          
          if(online())
          {
            funcPtr();
          }

          onlineCallbacks.push(funcPtr);  

        }

        if (DeviceReady.ready())
        {
          onlineHandler();
        }
        else
        {
          console.log("online device callback pushed");
          deviceReadyCallBacks.push(onlineHandler);
        }

      },

      offline: function (funcPtr) {

        function offlineHandler() {
          
          if(online() == false)
          {
            funcPtr();
          }

          offlineCallbacks.push(funcPtr);  

        }


        if (DeviceReady.ready())
        {
          offlineHandler();
        }
        else
        {
          console.log("offline device callback pushed");
          deviceReadyCallBacks.push(offlineHandler);
        }

      },

      state: function () {

        var state = 'unknown';

        if (DeviceReady.ready())
        {
          state = connectionState();
        }
         
        return state;
      }

    };
  });
