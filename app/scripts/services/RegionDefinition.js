'use strict';

angular.module('CACMobile')
  .factory('RegionDefinition', function () {
    // Service logic
    // ...

    var regions = {"regions": [
          {"name":"cariboos", "display":"North Columbia Cariboos"},
          {"name":"kananaskis", "display":"Kananaskis"},
          {"name":"kootenay-boundary", "display":"Kootenay Boundary"},
          {"name":"lizardrange", "display":"Lizard Range"},
          {"name":"monashees-selkirks", "display":"North Columbia Monashees & Selkirks"},
          {"name":"northwest-coastal", "display":"Northwest-Coastal"},
          {"name":"northwest-inland", "display":"Northwest-Inland"},
          {"name":"north-shore", "display":"North Shore"},
          {"name":"purcells", "display":"Purcells"}
        ]
    };

    // Public API here
    return {
      get: function () {
        return regions;
      }
    };
  });
