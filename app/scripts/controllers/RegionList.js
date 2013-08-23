'use strict';

angular.module('CACMobile')
  .controller('RegionlistCtrl', function ($scope, $location, Forecast, ConnectionManager, RegionDefinition) {
    
    $scope.map = function () {
        $location.path("/Map");
    }

    $scope.online = ConnectionManager.isOnline() ? "online" : "offline";
     
    $scope.regionList = RegionDefinition.get();

});	


