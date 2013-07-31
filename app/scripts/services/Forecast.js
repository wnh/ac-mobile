'use strict';
/*
angular.module('blahApp')
  .service('Forecast', function Forecast() {
    // AngularJS will instantiate a singleton by calling "new" on this function
  });*/


angular.module('App')
.factory('Forecast', function($rootScope,$q, Data){
	
   var apply = function () {$rootScope.$apply();};
   
   var transform = function(result) {
		var json = x2js.xml_str2json(result);
		return json;
	}; 

   var getUrlForRegion = function (region){
		var bulletinUrl = 'http://www.avalanche.ca/dataservices/cac/bulletins/xml/'; // \todo make this a config param
		return bulletinUrl + region; 
	};
		
   return {

	   get: function (region)
	   {
		   var fileName = region + ".json";
		   var defer = $q.defer();    	  

		   Data.fileRead(fileName).then(
					 function (data)
					 {
						 //console.log("Request succeeded");
			             defer.resolve(data);
					 },
					 function (error)
					 {
						 console.log('requesting XML from http');
						 Data.httpGetXml(getUrlForRegion(region), transform).then(
								 function (data)
								 {
									 console.log("received data from http writing to file");
									 var forecast = data.ObsCollection.observations.Bulletin; 
									 Data.fileWrite(fileName, JSON.stringify(forecast).split());
									 defer.resolve(forecast);
								 },
								 function (error)
								 {
									console.log("error getting xml forecast from http for " + filename + "error ", error);
									defer.reject(error);
								 });
 
					 })

           
     	  return defer.promise;			 
       }
      
   }
   
});
   