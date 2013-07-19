'use strict';
angular.module('App')
.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

angular.module('App')
.factory('RemoteData', function($http,$rootScope,$q){
	
   var apply = function () {$rootScope.$apply();};
   
   return {
       get: function(region,transform){
     	    var defer = $q.defer();    	   
    	   	var file = 'http://www.avalanche.ca/dataservices/cac/bulletins/xml/' + region; // \todo make this a config param
    	   	console.log ("requesting data from " + file);
            
    	   	$http.get(
                file,
                {transformResponse:transform}
            ).
            success(function(data, status) {
                console.log("Request succeeded");
                defer.resolve(data);
            }).
            error(function(data, status) {
                console.log("Request failed " + status);
                defer.reject(status);
            });
            
      	  return defer.promise;
       }
   }
   });


/*
angular.module('App')
.factory('updateData', function ($rootScope, $q) {
	  
	  var apply = function () {
        $rootScope.$apply();
  };  
    
  return {
      update: function () {
    	  
    	  var defer = $q.defer();
    	  
    	  $http({
    			method: 'GET',
    			url: 'http://www.avalanche.ca/dataservices/cac/bulletins/xml/south-coast', //todo \replace with region
    			headers: {
    				'Accept': 'application/xml'
    			},
    			transformResponse: function(data) {
    				var json = x2js.xml_str2json( data );
    				return json;
    			},
    			cache: false,
    			}),
    			success(function(data, status) {
    				defer.resolve(data);
    			}),
    			error(function(data, status) {
    				defer.reject(status);
    		});

    	  return defer.promise;
    	  
     

      }
  }
}); */


