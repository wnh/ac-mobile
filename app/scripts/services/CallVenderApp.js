'use strict';

angular.module('CACMobile')
  .factory('CallVenderApp', function ($location) {
    
    return {
     mec : function () {

        var mecAppUrl = 'fb206084672860640://';

        //! todo this should be generalised function so that multiple apps can be registered (each just takes appUrl, website and device list as params)
        if(navigator.userAgent.match(/(iPhone|iPod|iPad)/)) //! extend this for each device that the mec app is available for
        {
          window.appavailability(mecAppUrl, function(availability) {
              if(availability==true) 
              { 
                console.log('App is available'); 
                window.open(mecAppUrl,'_self','location=no');
              }
              else
              {
                console.log('App unavailable');  
                window.open('http://www.mec.ca','_system','location=no');
              }
            });
        }
        else
        {
          console.log("open mec website in a new window");
          window.open('http://www.mec.ca','_system','location=no');
        }

      }
    };
  });
