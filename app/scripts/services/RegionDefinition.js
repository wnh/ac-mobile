'use strict';

angular.module('CACMobile')
  .factory('RegionDefinition', function ($log, ConnectionManager, ResourceFactory) {
    // Service logic
    // ...

    var regions = localStorage.getItem("regions");

    if (ConnectionManager.isOnline())
    {
        ResourceFactory.region.get(function(data){
                                                  regions = data;
                                                  localStorage.setItem("regions",regions);
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
        var keys = Object.keys(regions);
        var regionArray = [];
        for (var i=0;i<keys.length;i++) {
          regionArray.push({name:keys[i],display:regions[keys[i]].display});
        }
        return regionArray;
      },

      getUrl: function (region) {
        var retVal = null;
        if (regionExists(region) == true){
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
