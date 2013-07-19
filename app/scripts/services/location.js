'use strict';

angular.module('App')
  .factory('getPosition', function ($rootScope, $q) {
	  
	  var apply = function () {
          $rootScope.$apply();
    };  
      
    return {
        update: function () {
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