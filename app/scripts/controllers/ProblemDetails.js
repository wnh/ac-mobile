'use strict';

angular.module('CACMobile')
  .controller('ProblemDetailsCtrl', function ($scope,$routeParams,Forecast) {
    
	   $scope.back = function () {
	    	window.history.back();
	   }

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

	  $scope.aspectRange = [ {name: 'AspectRange_N'	, pos:0},
					 {name: 'AspectRange_NE', pos:1},
					 {name: 'AspectRange_E'	, pos:2},
					 {name: 'AspectRange_SE', pos:3},
					 {name: 'AspectRange_S'	, pos:4},
					 {name: 'AspectRange_SW', pos:5},
					 {name: 'AspectRange_W'	, pos:6},
					 {name: 'AspectRange_NW', pos:7}];

		$scope.elevationRange = [{name: 'ElevationLabel_Btl', pos:0}, 
										 {name: 'ElevationLabel_Tln', pos:1}, 
										 {name: 'ElevationLabel_Alp', pos:2}];

	  $scope.stringBuilder = function (source, key, target) {
	  		
	  		var result = [];
	  		for (var a =0; a < target.length; ++a)
	  		{
	  			result[a] = 0;
	  		}

	  		for (var i =0; i < source.length; ++i)
	  		{
	  			for (var j =0; j < target.length; ++j)
		  		{
		  			if (source[i][key] == target[j].name)
		  			{
		  				result[j] = 1;
		  			}

		  		}
	  		}

	  		return (result.toString()).replace(new RegExp(',' , 'g'),"-");
	  }

	  // build image strings
	   
  });



