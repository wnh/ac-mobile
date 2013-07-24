'use strict';

angular.module('App')
  .controller('RegionDetailsCtrl', function ($scope, $routeParams, Forecast) {
    $scope.region = $routeParams.region;
    //$scope.data = "qwerty";
   
    /*
    $scope.dataOut = "Test";
    
    $scope.writeData = function (){
    	Data.fileWrite("file.temp", [$scope.data])
    }
    
    $scope.getData = function (){
    	Data.fileRead("file.temp").then(
    			function(data){
    				alert("test");
    				$scope.dataOut = data;
    			},
    			function(error){
    				$scope.dataOut = error;
    			});
    }*/
    
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
