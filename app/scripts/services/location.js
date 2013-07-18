'use strict';

//angular.module('App')
//  .service('location', function location() {
    // AngularJS will instantiate a singleton by calling "new" on this function
//  });

/*
var myModule = angular.module('App', []);
myModule.factory('location', function() {
  var pos = 0;
  //factory function body that constructs shinyNewServiceInstance
  return pos;
});*/

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