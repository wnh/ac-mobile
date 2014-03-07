'use strict';

angular.module('CACMobile')
  .factory('RegionDefinition', function ($log, ConnectionManager, ResourceFactory) {
    // Service logic
    // ...

    var regions = null;

    if (localStorage.getItem("regions"))
    {
      regions = JSON.parse(localStorage.getItem("regions"));
    }

    if (ConnectionManager.isOnline())
    {
        ResourceFactory.region().get(
          {},
          function(response){
            $log.info("received region data");
            regions = response.regions;
            localStorage.setItem("regions",JSON.stringify(regions));
          },
          function(error){
            $log.error(error);
          });
    }


    var regionExists = function (region)
    {
      var retVal = false;

      if (regions && regions[region])
      {
        retVal = true;
      }

      return retVal;
    };

    return {

      get: function () {
        return regions;
      },

      exists: function (region){
          return regionExists(region);
      },

      getArray: function () {

        var regionArray = [];
        if (regions != null)
        {
          var keys = Object.keys(regions);
          for (var i=0;i<keys.length;i++) {
            regionArray.push({name:keys[i],display:regions[keys[i]].display});
          }
        }

        return regionArray;
      },

      getUrl: function (region) {
        var retVal = null;
        if (regions != null && regionExists(region) == true){
          retVal = regions[region].url;
        }
        else
        {
          $log.error("Undefined Region", region);
        }
        return retVal;
      }

    };
  });
