'use strict';

angular.module('CACMobile')
  .factory('CallVenderApp', function ($location) {
    
    return {
     mec : function () {

        var mecAppUrl = 'fb206084672860640://';

        //! todo this should ge generalised function so that multiple apps can be registered

        if(navigator.userAgent.match(/(iPhone|iPod|iPad)/)) //! extend this for each device that the mec app is available for
        {
          alert("redirect");
          window.appavailability(mecAppUrl, function(availability) {
              if(availability==true) 
              { 
                console.log('App is available'); 
                window.open(mecAppUrl,'_blank','location=no');
              }
              else
              {
                console.log('App unavailable');  
                window.open('http://www.mec.ca','_blank','location=no');
              }
            });

          //PhoneGap.exec(success, fail, "callvenderapp", "run", ['fb206084672860640://', 'http://mec.ca/']);
        }
        else
        {
          console.log("open mec website in a new window");
          window.open('http://www.mec.ca','_blank','location=no');
        }

      }
    };
  });
