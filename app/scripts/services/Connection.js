'use strict';

angular.module('CACMobile')
  .factory('ConnectionManager', function($rootScope, DeviceReady, $location) {

    //! {
    var defaultState = {'type':'unknown'}; //{'type':'wifi'}; //{'type':'unknown'};

    //! if debugging in web mode
    if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/))
    {
      defaultState = {'type':'wifi'};
    }

    function connectionState() {
        var connection_   =  (navigator.connection === undefined) ? defaultState : navigator.connection ;
        var networkState_ = connection_.type;
        return networkState_;
    }

    function online () {
        var connection_   = (navigator.connection === undefined) ? defaultState : navigator.connection;
        var networkState_ = connection_.type;
        return ((networkState_ !=  'none') && (networkState_ !=  'unknown') )
    }
    //! }


    //! Handle Change of connection device state {
    var deviceReadyCallBacks = [];
    var onlineCallbacks = [];
    var offlineCallbacks = [];

    function performCallBack (cb) {

      var numItems = cb.length;
      for (var i = 0; i < numItems; i++) {
        var func = cb.pop();

        if(func != null)
        {
          console.log("performing device ready callback ConnectionManager");
          func();
        }
        else
        {
          console.error("null function pointer ConnectionManager");
        }

      }

    }

    function performOnlineCallback () {
      performCallBack(onlineCallbacks);
    }

    function performOfflineCallback () {
      performCallBack(offlineCallbacks);
    }

    function performDeviceReadyCallback () {
      document.addEventListener("online", performOnlineCallback, false);
      document.addEventListener("offline", performOfflineCallback, false);

      console.log("Connection Device Ready");


      if(online() == true)
      {
        $location.path("/Map");
      }
      else
      {
        $location.path("/region-list");
      }

      /*if (online() == false)
      {
        alert("No connection detected, check back soon for a version with offline capability.");
      }*/

      performCallBack(deviceReadyCallBacks);
    }

    DeviceReady.addEventListener(performDeviceReadyCallback);
    //! }

    return {

      //! return true if online, false is offline or state is unknown
      isOnline : function(){
        return online();
      },
      checkOnline: function() {
        if (!online()) {
         $location.path("/region-list");
         return false;
        }
        else
        {
          return true;
        }

      },

      //! takes a function/action to perform when online
      //! Check connection state and if state is already met then perform action
      //! Regsiter callback so that on appropriate state change action is performed
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
        {
          console.log("online device callback pushed");
          deviceReadyCallBacks.push(onlineHandler);
        }

      },

      //! takes a function/action to perform when offline
      //! Check connection state and if state is already met then perform action
      //! Regsiter callback so that on appropriate state change action is performed
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
