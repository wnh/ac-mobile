'use strict';

angular.module('App')
  .controller('ProblemDetailsCtrl', function ($scope,$routeParams,Forecast) {
    
	  $scope.region = $routeParams.region;
	    
	  Forecast.get($scope.region).then(
	    			function(data){
	    				//$scope.problemDetails = data.bulletinResultsOf.BulletinMeasurements.avProblems;
	    				
	    				//! if multiple av problems exist is the first one always the correct one to show ? Should we show multiple ?
	    				
	    				$scope.avyProblems = data.bulletinResultsOf.BulletinMeasurements.avProblems.avProblem_asArray 
	    				//$scope.problemDetails = avProb;
	    				
	    				
		    				 				 
	    			},
	    			function(error){
	    				alert('error getting forecast', error);
	    			}
	    			
	    	);
	    	
  });
