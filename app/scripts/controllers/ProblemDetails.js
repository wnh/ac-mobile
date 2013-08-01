'use strict';

angular.module('App')
  .controller('ProblemDetailsCtrl', function ($scope,$routeParams,Forecast) {
    
	  $scope.region = $routeParams.region;
	    
	  Forecast.get($scope.region).then(
	    			function(data){
	    				$scope.problemDetails = data.bulletinResultsOf.BulletinMeasurements.avProblems;
		    				 				 
	    			},
	    			function(error){
	    				alert('error getting forecast', error);
	    			}
	    			
	    	);
	    	
  });
