'use strict';

angular.module('App')
  .controller('ForecastDetailsCtrl', function ($scope, $routeParams, Forecast) {
	  
	  $scope.region = $routeParams.region;
	    
	  Forecast.get($scope.region).then(
	    			function(data){
	    				$scope.av = data.bulletinResultsOf.BulletinMeasurements.avActivityComment;
	    				$scope.snowPack = data.bulletinResultsOf.BulletinMeasurements.snowpackStructureComment;
	    				$scope.weather =  data.bulletinResultsOf.BulletinMeasurements.wxSynopsisComment;
	    			},
	    			function(error){
	    				alert('error getting forecast', error);
	    			}
	    			
	    	);
  });
