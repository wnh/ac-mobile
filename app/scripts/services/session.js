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
          $log.info("Sessions token created on server and stored to localStorage token= "+response.token);
          storageService.setItem("sessionToken", response.token);
          success();
        },
        function(response){
          fail(response.data.error[0]);
        });
      },

      destroy: function (){

        if (localStorage.getItem("sessionToken") != null)
        {
          ResourceFactory.session().destroy({'token':localStorage.getItem("sessionToken")},
            function(response){
              $log.info("token deleted from server");
            },
            function(response){
              $log.warn("Unable to delete token from server");
          });

          localStorage.removeItem("sessionToken");
        }
        else
        {
          $log.warn("Attempted to destroy session but no sessions exists");
        }



      },

      token: function (){
        return localStorage.getItem("sessionToken");
      }


    }

    window.localStorage.setItem();
  });
