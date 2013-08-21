'use strict';

angular.module('CACMobile')
.factory('Forecast', function($rootScope,$q, Data){
	

   var regionFileName = "regions.json";
   var apply = function () {$rootScope.$apply();};
   
   var transform = function(result) {
		var json = "";

      try{
         json = x2js.xml_str2json(result);
      }
      catch (e) {
         console.error("Unable to convert from XML to JSON");
      }
	
   	return json;
	}; 

   var getUrlForRegion = function (region){
		var bulletinUrl = 'http://www.avalanche.ca/dataservices/cac/bulletins/xml/'; // \todo make this a config param
		var date = '/2013-02-21' ;// for testing only! get old bulletins that have real data
		return bulletinUrl + region + date; 
	};
		
   return {

      getRegions: function ()
      {
   		var defer = $q.defer(); 

      	var regionList = ["cariboos", 
                			  "kananaskis", 
                			  "kootenay-boundary", 
                			  "lizardrange", 
                			  "monashees-selkirks", 
                			  "northwest-coastal", 
                			  "northwest-inland",
                			  "north-shore",
                			  "purcells"];

         defer.resolve(regionList);
      		
         return defer.promise;
      },

	   get: function (region)
	   {
         var defer = $q.defer();
		  
         //! Get the file for the region from HTTP as xml convert to json
         function getFromHttp () {
   	  		Data.httpGetXml(getUrlForRegion(region), transform).then(
				 function (data) // get from http succeeded
				 {
					 //! Got Data from HTTP save to file {
					 console.log("received data from http");
					 var forecast = data.ObsCollection.observations.Bulletin; 
					 //! }

					 defer.resolve(forecast);					 
				 },

				 function (error) // get from http failed
				 {
					//! Error Getting Data from HTTP 
					console.error("error getting xml forecast from http for " + region + "error ", error);
					defer.reject(error);
					//! }
				 });
         } //! } end function getFromXml  	  
      
         getFromHttp();
           
         return defer.promise;			 
       }
      
   }
   
});
   