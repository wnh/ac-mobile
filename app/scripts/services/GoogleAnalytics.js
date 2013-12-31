'use strict';

angular.module('CACMobile')
  .factory('GoogleAnalytics', function (DeviceReady, platform, $log) {
      var success = function(result) {$log.info("GA Sucess " + result);};
      var error   = function(result) {$log.error("GA Error " + result);};
      var initialised = false;
      var gaPlugin;

      if (platform.isWeb() == false)
      {
        //! Register google analytics plugin
        var initialise = function () {
          $log.info("Regsitering google analytics");
          gaPlugin = window.plugins.gaPlugin;
          gaPlugin.init(
                        function (result) {
                                            $log.info("google analytics registered " + result);
                                          },
                        function (error){$log.warn("google analytics FAILED to register "+ error ); },
                        "UA-46606603-1", 10);
        };

        DeviceReady.addEventListener(initialise);
      }

      return {

      trackPage: function (page) {
        $log.info("Location changed to " + page + " analytics updated");
        if (platform.isWeb() == false)
        {
          gaPlugin.trackPage(success, error, page);
        }
      },

      //! category - This is the type of event you are sending such as "Button", "Menu", etc.
      //! eventAction - This is the type of event you are sending such as "Click", "Select". etc.
      //! eventLabel - A label that describes the event such as Button title or Menu Item name.
      trackEvent: function(category, eventAction, eventLabel) {
        if (platform.isWeb() == false)
        {
          gaPlugin.trackEvent(success, error, category, eventAction, eventLabel, 1);
        }
      }
      //! }

    };

  });
