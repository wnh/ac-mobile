'use strict';

angular.module('CACMobile')
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


		  //! Get the file for the region from HTTP as xml convert to json and save locally	
	   	  function getFromHttp () {
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
	   	  } //! } end function getFromXml  	  

		   Data.fileRead(fileName).then(
					 function (data)
					 {
						 //! Got Data from File {
						 //if (data.date != today then get from xml)
						 defer.resolve(data);
						 //}
					 },
					 function (error)
					 {
						 //! Error Getting Data from File try from HTTP {
						 console.log('requesting XML from http');
						 getFromHttp();
						 //! }
 
					 })

           
     	  return defer.promise;			 
       }
      
   }
   
});
   