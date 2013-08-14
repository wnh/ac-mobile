'use strict';

angular.module('CACMobile')
  .controller('RegionlistCtrl', function ($scope, $location, Forecast, ConnectionManager) {
    
    $scope.back = function () {
    	window.history.back();
    }

    $scope.map = function () {
        $location.path = "/Map";
    }

    $scope.online = ConnectionManager.isOnline() ? "online" : "offline";
    $scope.regionList = Forecast.getRegions();

});	


