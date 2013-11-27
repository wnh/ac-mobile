'use strict';

angular.module('CACMobile')
  .factory('RegionDefinition', function ($log) {
    // Service logic
    // ...

    var regions = {
          "Banff Yoho Kootenay":{display:"Banff, Yoho and Kootenay National Parks", url:"http://avalanche.pc.gc.ca/CAAML-eng.aspx?d=TODAY&r=1", type:"parks"},
          "Glacier":{display:"Glacier National Park", url:"http://avalanche.pc.gc.ca/CAAML-eng.aspx?d=TODAY&r=3", type:"parks"},
          "Jasper":{display:"Jasper National Park", url:"http://avalanche.pc.gc.ca/CAAML-eng.aspx?d=TODAY&r=2", type:"parks"},
          "Kananaskis Country":{display:"Kananaskis", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/Kananaskis", type:"cac"},
          "Kootenay Boundary":{display:"Kootenay Boundary", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/Kootenay-Boundary", type:"cac"},
          "Lizard Range":{display:"Lizard Range", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/Lizardrange", type:"cac"},
          "North Columbia - Monashees and Selkirks":{display:"North Columbia Monashees & Selkirks", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/Monashees-Selkirks", type:"cac"},
          "Northwest - Coastal":{display:"Northwest-Coastal", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/Northwest-Coastal", type:"cac"},
          "North Columbia - Cariboos":{display:"North Columbia Cariboos", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/Cariboos", type:"cac"},
          "Northwest - Inland":{display:"Northwest-Inland", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/Northwest-Inland", type:"cac"},
          "North Shore":{display:"North Shore", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/North-Shore", type:"cac"},
          "Purcells":{display:"Purcells", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/Purcells", type:"cac"},
          "Sea to Sky":{display:"Sea To Sky", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/Sea-to-Sky", type:"cac"},
          "South Columbia":{display:"South Columbia", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/South-Columbia", type:"cac"},
          "South Coast - Inland":{display:"South Coast - Inland", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/South-Coast", type:"cac"},
          "South Rockies":{display:"South Rockies", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/South-Rockies", type:"cac"},
          "Waterton":{display:"Waterton Lakes National Park", url:"http://avalanche.pc.gc.ca/CAAML-eng.aspx?d=TODAY&r=4", type:"parks"},
          "Yukon":{display:"Yukon", url:"http://www.avalanche.ca/dataservices/cac/bulletins/xml/yukon", type:"cac"}
        };

    var regionExists = function (region)
    {
      var retVal = false;

      if (regions[region])
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
