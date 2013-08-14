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
    var defaultState = {'type':'wifi'}; //{'type':'wifi'}; //{'type':'unknown'};

    function connectionState() {
        var connection_   = navigator.connection  || defaultState;
        var networkState_ = connection_.type;
        return networkState_;
    }

    function online () {
        var connection_   = navigator.connection  || defaultState;
        var networkState_ = connection_.type;
        return ((networkState_ !=  'none') && (networkState_ !=  'unknown') )  
    }
    //! }

    return { 
      
      //! return true if online, false is offline or state is unknown
      isOnline : function(){
        return online();
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
        else
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
