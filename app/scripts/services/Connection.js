'use strict';

angular.module('CACMobile')
  .factory('ConnectionManager', function($rootScope, $route, DeviceReady, $location) {

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
    var resumeCallbacks = [];

    function performCallBack (cb) {

      var numItems = cb.length;
      for (var i = 0; i < numItems; i++) {
        var func = cb.pop();

        if(func != null)
        {
          console.log("performing device ready callback ConnectionManager");
          func();
          $rootScope.$apply();
        }
        else
        {
          console.error("null function pointer ConnectionManager");
        }

      }

    }

    function performResumeCallbacks(){
      //RegionDefinition.update();
      //$route.reload();
      performCallBack(resumeCallbacks);
    }

    function performOnlineCallback () {
      //RegionDefinition.update();
      performCallBack(onlineCallbacks);
    }

    function performOfflineCallback () {
      performCallBack(offlineCallbacks);
    }

    function performDeviceReadyCallback () {

      //! When the device goes online iterate through online callbacks
      document.addEventListener("online", performOnlineCallback, false);

      //! when the device goes offline iterate through offline callbacks
      document.addEventListener("offline", performOfflineCallback, false);

      //! on resume resfresh the current view
      document.addEventListener("resume", performResumeCallbacks, false);

      console.log("Connection Device Ready");

      performCallBack(deviceReadyCallBacks);
    }

    var addResumeCallback = function(cb)
    {
      if (cb != null)
      {
        resumeCallbacks.push(cb);
      }
    };

    var refresh = function()
    {
      $route.reload();
    };

    addResumeCallback(refresh);

    DeviceReady.addEventListener(performDeviceReadyCallback);
    //! }

    return {

      //! return true if online, false is offline or state is unknown
      isOnline : function(){
        return online();
      },

      //! takes a function/action to perform when device resumes
      addResumeCallback: function (cb)
      {
        addResumeCallback(cb);
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

          //! if already online we missed the online event so call the function
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
