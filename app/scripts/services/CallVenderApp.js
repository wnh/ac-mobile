'use strict';

angular.module('CACMobile')
  .factory('CallVenderApp', function ($location) {
    
    return {
     call : function () {

          function fail() { console.log("CallVenderApp succeeded"); }
          function success() {onsole.error("CallVenderApp Error :",error); }
        
        if(navigator.userAgent.match(/(iPhone|iPod|iPad)/)) //! \todo generalise this function
        {

          PhoneGap.exec(success, fail, "callvenderapp", "run", ['fb206084672860640://', 'http://mec.ca/']);

        }
        else
        {
          //$location.path("http://www.mec.ca");// \todo make MEC store URL a config variable
          window.open('http://www.mec.ca','_blank','location=no');
        }

      }
    };
  });
