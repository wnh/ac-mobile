'use strict';

angular.module('CACMobile')
  .controller('RegionlistCtrl', function ($scope, $location, $log, Forecast, Data, ConnectionManager, RegionDefinition) {

    $scope.alerts = [];

    $scope.map = function () {
        $location.path("/Map");
    }

    $scope.online = ConnectionManager.isOnline() ? "online" : "offline";

    $scope.regionList = RegionDefinition.getArray();

    if(ConnectionManager.isOnline() == false)
    {
      $scope.alerts.push({ type: 'error', msg: 'No connection available. Showing only previously loaded regions' });
    }

    $scope.checkCache = function (region)
    {
      var ret = false;
      if (ConnectionManager.isOnline() == true)
      {
        ret = true;
      }
      else
      {
        ret = Data.inCache(region);
      }

      return ret;
    }

    $scope.$watch(function () { return ConnectionManager.isOnline(); },
    function() {
      if ($scope.online == "offline" && ConnectionManager.isOnline() == true) {
        $location.path("/Map")
      }
    },true)

});


