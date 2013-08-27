'use strict';

angular.module('CACMobile')
  .factory('RegionDefinition', function () {
    // Service logic
    // ...

    var regions = {
          "Cariboos":"North Columbia Cariboos",
          "Kananaskis":"Kananaskis",
          "Kootenay-Boundary":"Kootenay Boundary",
          "Lizardrange":"Lizard Range",
          "Monashees-Selkirks":"North Columbia Monashees & Selkirks",
          "Northwest-Coastal":"Northwest-Coastal",
          "Northwest-Inland":"Northwest-Inland",
          "North-Shore":"North Shore",
          "Purcells":"Purcells",
          "South-Columbia":"South Columbia",
          "Sea-to-Sky":"Sea To Sky"
        };

    // Public API here
    return {
      get: function () {
        return regions;
      },
      getArray: function () {
        var keys = Object.keys(regions);
        var regionArray = [];
        for (var i=0;i<keys.length;i++) {
          regionArray.push({name:keys[i],display:regions[keys[i]]});
        }
        return regionArray;
      }
    };
  });
