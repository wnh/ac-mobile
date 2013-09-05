'use strict';

angular.module('CACMobile')
  .controller('ProblemDetailsCtrl', function ($scope,$routeParams,Forecast, RegionDefinition) {

	  $scope.region = $routeParams.region;
	  var regions = RegionDefinition.get();
     $scope.regionDisplayName = regions[$scope.region].display;
	    
	  Forecast.get($scope.region).then(
	    			function(fx){
	    				$scope.avyProblems = fx.avyProblems;
	    			},
	    			function(error){
	    				console.error('error getting forecast', error);
	    			}
	    			
	    	);

	  // build image strings
	   
  });