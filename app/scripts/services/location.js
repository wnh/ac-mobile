'use strict';

angular.module('App')
  .factory('location', function ($rootScope, $q) {
	  
	  var apply = function () {
          $rootScope.$apply();
    };  
      
    return {
        getPosition: function () {
        	var defer = $q.defer();
        	navigator.geolocation.getCurrentPosition(
        			function (position)
        			{
        				defer.resolve(position);
        				apply();
        			}); 
        	return defer.promise;
        }
    }
});