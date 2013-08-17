'use strict';

angular.module('CACMobile')
.factory('Forecast', function($rootScope,$q, Data, ConnectionManager){
	

   var regionFileName = "regions.json";
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

   		getRegions: function ()
   		{
       		var defer = $q.defer(); 

       		//! if online get the region list from X \\todo
   			ConnectionManager.online(
               function  () {
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
       			});

      		//! If offline get the region list from the file of saved regions
   			ConnectionManager.offline( 
               function () 
               { 	
                  Data.fileRead(regionFileName).then(
                     function (data)
                     {
                        console.log("file read regions result", data);
                        var regions = data.replace(/,$/,''); //! if the last char is a , remove it
                        defer.resolve(regions.split(","));	
                     });
               });

            return defer.promise;
   		},

	   get: function (region)
	   {
	   	  var fileName = region + ".json";
		  var defer = $q.defer();

		  //! write to the region file, this is used to store which regions are stored locally
		  function writeRegionToFile (region) {
			Data.fileWrite(regionFileName, [region + ","] , {type: 'text/plain'}, true);
		  }

		  //! Get the file for the region from HTTP as xml convert to json and save locally	
	   	  function getFromHttp () {
	   	  		Data.httpGetXml(getUrlForRegion(region), transform).then(
	   	  		//Data.httpGetJson("http://json-generator.appspot.com/j/gHOP?indent=4").then(
								 function (data) // get from http succeeded
								 {
									 //! Got Data from HTTP save to file {
									 console.log("received data from http writing to file");
									 var forecast = data.ObsCollection.observations.Bulletin; 
									 var data = (JSON.stringify(forecast)).split("");
									 Data.fileWrite(fileName, data, {type: 'application/json'} , false); 
	   	  							 //! }

	   	  							 //! if the stored region file does not already have the region documented then write it {
									 Data.fileRead(regionFileName).then(
									 		function (regionData)
									 		{
									 			if(regionData.indexOf(region) == -1)
									 			{
									 				writeRegionToFile(region);
									 			}
									 			
									 		},
									 		function (data)
									 		{
									 			writeRegionToFile(region);
									 		}
									 	);
									 //}

									 defer.resolve(forecast);
									 
								 },
								 function (error) // get from http failed
								 {
									//! Error Getting Data from HTTP 
									console.log("error getting xml forecast from http for " + region + "error ", error);
									defer.reject(error);
									//! }
								 });
	   	  } //! } end function getFromXml  	  

		   Data.fileRead(fileName).then(
					 function (data)//! Got Data from File
					 {
						 var jsonData = "";
						 var valid = false;

						 //! Try parse the data we read from file if there are any errors get it from http
						 try {
						    jsonData = JSON.parse(data);
						    valid = true;
						 } catch (e) {
						    valid = false;
						    console.log("error parsing file, fetching from HTTP");
						    getFromHttp();
						 }

						 //! if we got valid data from file check the dates on it
						 if (valid)
						 {
						 	defer.resolve(jsonData);
						 }
					 },
					 function (error) //! Error Getting Data from File try from HTTP 
					 {
						 console.log('requesting XML from http');
						 getFromHttp();
					 })

           
     	  return defer.promise;			 
       }
      
   }
   
});
   