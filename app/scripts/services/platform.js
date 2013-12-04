'use strict';

angular.module('CACMobile')
  .service('platform', function platform() {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var agentCheck = function () { return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/); };

    return {

      //! \todo comment
      get: function (){
        return window.navigator.userAgent;
      },

      isWeb: function (){
        return (agentCheck() == null);
      },

      isMobile: function(){
        return (agentCheck() != null);
      }
    }

  });
