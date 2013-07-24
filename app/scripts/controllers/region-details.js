'use strict';

angular.module('App')
  .controller('RegionDetailsCtrl', function ($scope, $routeParams, Forecast) {
    $scope.region = $routeParams.region;
    $scope.data = 'test';
    $scope.getData = function(){
    	Forecast.get($scope.region).then(
    			function(data){
    				$scope.data = data;
    			},
    			function(error){
    				alert('error', error);
    			}
    			
    	)};
    
  });
