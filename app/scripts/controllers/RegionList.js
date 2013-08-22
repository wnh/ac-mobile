'use strict';

angular.module('CACMobile')
  .controller('RegionlistCtrl', function ($scope, $location, Forecast, ConnectionManager, Data) {
    
    $scope.map = function () {
        $location.path("/Map");
    }

    $scope.online = ConnectionManager.isOnline() ? "online" : "offline";
     
     Data.httpGetJson("config/regions.json").then(function (data) {
         $scope.regionList = data;
      },
      function (error) {
         console.error("Error fetching region list", error);
      })
    /*{"regions": [
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
*/
});	


