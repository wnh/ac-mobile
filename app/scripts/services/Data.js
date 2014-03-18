'use strict';
//Provides services for getting Data from HTTP and local file
//Does not use any instance specific information instead acts as a facade wrapper

angular.module('CACMobile')
.factory('Data', function($http,$rootScope,$q, $log, ConnectionManager, platform, DeviceReady){

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

   var getXml = function(url){
                  var defer = $q.defer();

                  console.log ("requesting data from " + url);

                  $http.get(url).
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
                    error(function(data, status, headers, config){
                        console.error("Http Get Failed with", status);
                        defer.reject(status);
                    });

                  return defer.promise;
               };

   var xmlToJson = function(result) {
    var json = "";

      try{
         json = x2js.xml_str2json(result);
      }
      catch (e) {
         $log.error("Unable to convert from XML to JSON");
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
            if (storageService != null)
            {

              //! get from local storage
              var data = null;
              data = storageService.getItem(region);

              if ((data === null) && (ConnectionManager.isOnline() == false))
              {
                $log.info("Got Data from local storage");
                //var result = JSON.parse(data);defer.resolve(result);
                var json = xmlToJson(data);
                defer.resolve({'data':json, 'cache': true});
              }
              else
              {
                if (errorCount < maxTries)
                {
                  getXml(url).then(success, fail);
                }
                else
                {
                  errorCount = 0;
                  $log.error("Invalid Response To many Retries");
                  defer.reject("Invalid Response To many Retries");
                }
              }

            }
            else
            {
              $log.error("Storage Service Null or Void");
              defer.reject("Storage Service Null or Void");
            }
          }

          var success = function (data)
          {
            errorCount = 0;
            $log.info("item added to local storage");
            storageService.setItem(region, data);
            var json = xmlToJson(data);
            defer.resolve({'data':json, 'cache': false});
          }

          var fail = function (error)
          {
            $log.error("Error getting data, errorCount incremented. Error: "+ error);
            errorCount ++;
            getData();
          }

          getData();
          return defer.promise;
      },

      clear: function (region)
      {
        if (storageService.getItem(region) != null)
        {
          $log.info("removed " + region + " from local storage");
          storageService.removeItem(region);
        }
        else
        {
          $log.info("Attempted to remove " + region + " from local storage when no data for key exists");
        }
      },

      inCache: function (region)
      {
        return (storageService.getItem(region) != null);
      }

   }// End return

   }); //End Factory

