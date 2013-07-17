'use strict';

angular.module('App')
  .controller('RegionDetailsCtrl', function ($scope, $routeParams) {
    $scope.region = $routeParams.region;
    
  });
