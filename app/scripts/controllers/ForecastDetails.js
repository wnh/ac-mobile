'use strict';

angular.module('CACMobile')
  .controller('ForecastDetailsCtrl', function ($scope, $routeParams, Forecast, RegionDefinition) {
	  
	  $scope.region = $routeParams.region;
	  var regions = RegionDefinition.get();
     $scope.regionDisplayName = regions[$scope.region].display;
	    
	  Forecast.get($scope.region).then(
	    			function(fx){
	    				$scope.av = fx.avSummary;
	    				$scope.snowPack = fx.snowPackSummary;
	    				$scope.weather =  fx.weatherSummary;
	    			},
	    			function(error){
	    				console.error('error getting forecast', error);
	    			}
	    			
	    	);
  });
