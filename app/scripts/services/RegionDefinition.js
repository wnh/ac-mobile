'use strict';

angular.module('CACMobile')
  .factory('RegionDefinition', function ($log, ConnectionManager, ResourceFactory) {
    // Service logic
    // ...

    var regions = null;

    var getRegions = function()
    {
      if (localStorage.getItem("regions"))
      {
        //! regions stored as string so need to parse to json
        regions = JSON.parse(localStorage.getItem("regions"));
      }

      if (ConnectionManager.isOnline())
      {
          ResourceFactory.region().get(
            {},
            function(response){
              $log.info("received region data");
              regions = response.regions;

              if (localStorage.getItem("regions"))
              {
                localStorage.removeItem("regions");
              }

              //! Store regions as string to lcal storage
              localStorage.setItem("regions",JSON.stringify(regions));
            },
            function(error){
              $log.error(error);
            });
      }
    };

    getRegions();
    ConnectionManager.addResumeCallback(getRegions);

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

      update: function (){
          getRegions();
      },

      get: function () {

        if (regions == null)
        {
          getRegions();
        }

        return regions;
      },

      exists: function (region){

        if (regions == null)
        {
          getRegions();
        }

        return regionExists(region);
      },

      getArray: function () {

        var regionArray = [];

        if (regions == null)
        {
          getRegions();
        }

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

        if (regions == null)
        {
          getRegions();
        }

        if (regions != null && regionExists(region) == true){
          retVal = regions[region].url;
        }
        else
        {
          $log.error("Undefined Region", region);
        }

        return retVal;
      },

      getType: function (region) {
        var retVal = null;

        if (regions == null)
        {
          getRegions();
        }

        if (regions != null && regionExists(region) == true){
          retVal = regions[region].type;
        }
        else
        {
          $log.error("Undefined Region", region);
        }

        return retVal;
      }

    };
  });
