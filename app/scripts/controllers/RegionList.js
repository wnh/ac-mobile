'use strict';

angular.module('CACMobile')
  .controller('RegionlistCtrl', function ($scope, Forecast) {
    
    $scope.back = function () {
    	window.history.back();
    }

    $scope.regionList = Forecast.getRegions();
/*
ConnectionManager.online(function  () {
	$scope.regionList = ["cariboos", 
    			  "kananaskis", 
    			  "kootenay-boundary", 
    			  "lizardrange", 
    			  "monashees-selkirks", 
    			  "northwest-coastal", 
    			  "northwest-inland",
    			  "north-shore",
    			  "purcells"];
    			});

ConnectionManager.offline( function () {
    $scope.regionList = ["purcells"];
    			});*/

});	

/*
<li><a href="#/region-details/cariboos">North Columbia - Cariboos</a></li>
							<li><a href="#/region-details/kananaskis">Kananaskis Country</a></li>
							<li><a href="#/region-details/kootenay-boundary">Kootenay Boundary</a></li>
							<li><a href="#/region-details/lizardrange">Lizard Range</a></li>
							<li><a href="#/region-details/monashees-selkirks">North Columbia - Monashees and Selkirks</a></li>
							<li><a href="#/region-details/northwest-coastal">Northwest Coastal</a></li>
							<li><a href="#/region-details/northwest-inland">Northwest Inland</a></li>
							<li><a href="#/region-details/north-shore">North Shore</a></li>
							<li><a href="#/region-details/purcells">Purcells</a></li>
							<li><a href="#/region-details/sea-to-sky">Sea to Sky</a></li>
							<li><a href="#/region-details/south-coast">South Coast - Inland</a></li>
							<li><a href="#/region-details/south-columbia">South Columbia</a></li>
							<li><a href="#/region-details/south-rockies">South Rockies</a></li>-->*/


