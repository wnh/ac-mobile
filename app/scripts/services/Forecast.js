'use strict';

angular.module('App')
.factory('Forecast', function($rootScope,$q, Data){
	
   var apply = function () {$rootScope.$apply();};
   
   var transform = function(result) {
		var json = x2js.xml_str2json(result);
	    //var json = x2js.xml2json(result) 
		return json;
	}; 

   var getUrlForRegion = function (region){
		var bulletinUrl = 'http://www.avalanche.ca/dataservices/cac/bulletins/xml/'; // \todo make this a config param
		var date = '/2013-02-21' ;// for testing only! get old bulletins that have real data
		return bulletinUrl + region + date; 
	};
		
   return {

	   get: function (region)
	   {
		   var fileName = region + ".json";
		   var defer = $q.defer();    	  

		   Data.fileRead(fileName).then(
					 function (data)
					 {
						 //! Got Data from File {
						 defer.resolve(data);
						 //}
					 },
					 function (error)
					 {
						 //! Error Getting Data from File try from HTTP {
						 console.log('requesting XML from http');
						 Data.httpGetXml(getUrlForRegion(region), transform).then(
								 function (data)
								 {
									 //! Got Data from HTTP save to file {
									 console.log("received data from http writing to file");
									 var forecast = data.ObsCollection.observations.Bulletin; 
									 Data.fileWrite(fileName, JSON.stringify(forecast).split());
									 defer.resolve(forecast);
									 //! }
								 },
								 function (error)
								 {
									//! Error Getting Data from HTTP 
									console.log("error getting xml forecast from http for " + region + "error ", error);
									alert("No Data Available for this region");
									defer.reject(error);
									//! }
								 });
						 //! }
 
					 })

           
     	  return defer.promise;			 
       }
      
   }
   
});
   