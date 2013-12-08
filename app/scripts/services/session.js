'use strict';

angular.module('CACMobile')
  .service('Session', function Session(ResourceFactory, platform, $log) {

    var storageService = null;

    if(platform.isMobile())
    {
      storageService = window.localStorage;
    }
    else if (platform.isWeb())
    {
      storageService = localStorage;
    }
    else
    {
      $log.error("unknown Platform");
    }

    return {


      loggedIn: function (){
          return (localStorage.getItem("sessionToken") != null);
      },

      logIn: function (sessionParams, success, fail){

        ResourceFactory.session().create(sessionParams,
        function(response){
          storageService.setItem("sessionToken", response.token);
          success();
        },
        function(response){
          fail(response.data.error);
        });
      },

      destroy: function (){
        localStorage.clear();
      },

      token: function (){
        return localStorage.getItem("sessionToken");
      }


    }

    window.localStorage.setItem();
  });
