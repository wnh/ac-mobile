'use strict';
//Provides services for getting Data from HTTP and local file
//Does not use any instance specific information instead acts as a facade wrapper


// allows  cross origin requests
angular.module('CACMobile')
.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


angular.module('CACMobile')
.factory('Data', function($http,$rootScope,$q, $log, platform, DeviceReady){

   var getXml = function(url,transform){
                  var defer = $q.defer();

                  console.log ("requesting data from " + url);

                  $http.get(
                        url,
                        {transformResponse:transform}
                    ).
                    success(function(data, status) {

                        if (data == null)
                        {
                          console.error("Got NULL Data From HTTP");
                          console.error(status);
                          defer.reject("NULL Data");

                        }
                        else
                        {
                          console.log("Got Data From HTTP status=", status);
                          defer.resolve(data);
                        }

                    }).
                    error(function(data, status) {
                        defer.reject(status);
                    });


                  return defer.promise;
               };

   var transform = function(result) {
    var json = "";

      try{
         json = x2js.xml_str2json(result);
      }
      catch (e) {
         console.error("Unable to convert from XML to JSON");
      }

    return json;
  };

   return {

      get: function (region, url)
      {
          var defer = $q.defer();

          var maxTries = 2;
          var errorCount = 0;
          var validResponse = false;

          $log.info("Data.get() for region " + region);

          var getData = function ()
          {
            getXml(url,transform).then(success, fail);
          }

          var success = function (data)
          {
            defer.resolve(data);
          }

          var fail = function (error)
          {
            errorCount ++;
            $log.error("Error getting data, errorCount incremented. Error: "+ error);

            if (errorCount < maxTries)
            {
              getData();
            }
            else
            {
              $log.error();
              defer.reject("Invalid Response To many Retries");
            }
          }

          getData();
          return defer.promise;
      }

   }// End return

   }); //End Factory

