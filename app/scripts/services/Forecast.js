'use strict';

angular.module('CACMobile')
.factory('Forecast', function($rootScope,$q, Data, RegionDefinition){
	
   var weekdays = new Array(7);
               weekdays[0] = "Sunday";
               weekdays[1] = "Monday";
               weekdays[2] = "Tuesday";
               weekdays[3] = "Wednesday";
               weekdays[4] = "Thursday";
               weekdays[5] = "Friday";
               weekdays[6] = "Saturday";


   var aspectRange = [ {name: 'AspectRange_N'   , pos:0},
             {name: 'AspectRange_NE', pos:1},
             {name: 'AspectRange_E' , pos:2},
             {name: 'AspectRange_SE', pos:3},
             {name: 'AspectRange_S' , pos:4},
             {name: 'AspectRange_SW', pos:5},
             {name: 'AspectRange_W' , pos:6},
             {name: 'AspectRange_NW', pos:7}];

   var elevationRange = [{name: 'ElevationLabel_Btl', pos:0}, 
                         {name: 'ElevationLabel_Tln', pos:1}, 
                         {name: 'ElevationLabel_Alp', pos:2}];

   function stringCleaner (str){
      
      //! remove HTML tags
      var div = document.createElement('div');
      div.innerHTML = str;

      var styles = div.getElementsByTagName("style");
      for (var i = 0; i < styles.length; i++) {
        jQuery(styles[i]).remove();
      }
      var out =   div.textContent || div.innerText || "" ;

      return out;
   }


   function stringBuilder (source, key, target) {
         
         var result = [];
         for (var a =0; a < target.length; ++a)
         {
            result[a] = 0;
         }

         for (var i =0; i < source.length; ++i)
         {
            for (var j =0; j < target.length; ++j)
            {
               if (source[i][key] == target[j].name)
               {
                  result[j] = 1;
               }

            }
         }

         return (result.toString()).replace(new RegExp(',' , 'g'),"-");
   }


   function CacData (jsonData)
   {
      var data = jsonData.ObsCollection.observations.Bulletin;
      //! Assumes we will always receive the days in the same order !
      this.today = processDay(data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[0]);
      this.tomorrow = processDay(data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[1]);
      this.dayAfter = processDay(data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[2]);
      this.confidence =  data.bulletinResultsOf.BulletinMeasurements.bulletinConfidence.Components.confidenceLevel.__text ;
      this.validTime = { issued  : data.validTime.TimePeriod.beginPosition.__text.replace("T"," ") ,
                         expires : data.validTime.TimePeriod.endPosition.__text.replace("T"," ") };

      this.avSummary = data.bulletinResultsOf.BulletinMeasurements.avActivityComment.__text ;
      this.snowPackSummary = data.bulletinResultsOf.BulletinMeasurements.snowpackStructureComment.__text ;
      this.weatherSummary =  data.bulletinResultsOf.BulletinMeasurements.wxSynopsisComment.__text ;

      this.avyProblems =  ProblemList();

      function ProblemList (){
         var result = [];
         
         if (data.bulletinResultsOf.BulletinMeasurements.avProblems_asArray.length > 1)
         {
            var problemList = data.bulletinResultsOf.BulletinMeasurements.avProblems.avProblem_asArray;
            var size = problemList.length;
            for (var i = 0; i < size; ++i)
            {
               result[i] = processProblem(problemList[i]);
            }
         }

         return result;
         //! \todo assert result.size = problemList.size
      }
      
      function processProblem(problem)
      {
         /*
         advisoryCommentArray = [];
         for (var i = 0; i < problem.travelAdvisoryComment_asArray.size, ++i)
         {
            advisoryCommentArray[i] = problem.travelAdvisoryComment_asArray[i].__text; 
         }*/

         return{
            elevationImg : "img/Elevation/Elevation-" + stringBuilder(problem.validElevation_asArray, '_xlink:href', elevationRange) + "_EN.png",
            aspectImg : "img/Compass/compass-" + stringBuilder(problem.validAspect_asArray, '_xlink:href', aspectRange) + "_EN.png",
            liklihoodImg : "img/Likelihood/Likelihood-" + problem.likelihoodOfTriggering.Values.typical.__text + "_EN.png",
            sizeImg : "img/Size/Size-" + problem.expectedAvSize.Values.min.__text + "-"+ problem.expectedAvSize.Values.max.__text + "_EN.png" ,
            comment : problem.comment.__text ,
            probType: problem.type.__text,
            advisoryComment: problem.travelAdvisoryComment.__text //! this was previoulsy an array, is there really ever more than one of these ?

            //avProblem.travelAdvisoryComment_asArray
         }
      }

      function processDay(day)
      {
         var alpine = day.dangerRatingAlpValue.__text || "N/A - No Rating";
         var alpineClass = (alpine  == "N/A - No Rating") ? "none" : alpine.toLowerCase();
         var treeline = day.dangerRatingTlnValue.__text || "N/A - No Rating";
         var treelineClass = (treeline  == "N/A - No Rating") ? "none" : treeline.toLowerCase();
         var belowTreeline = day.dangerRatingBtlValue.__text || "N/A - No Rating";
         var belowTreelineClass = (belowTreeline  == "N/A - No Rating") ? "none" : belowTreeline.toLowerCase();
         return {
            day: weekdays[new Date(day.validTime.TimeInstant.timePosition.__text).getDay()],
            alpine: {text: alpine, css: alpineClass},
            treeline: {text: treeline, css: treelineClass},
            belowTreeline: {text: belowTreeline, css: belowTreelineClass}
         }
      };
   }



   function ParksData (jsonData)
   {
      var data = jsonData.CaamlData.observations.Bulletin;

      //! Assumes we will always receive the days in the same order
      this.today = processDay(data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[0],
                              data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[3],
                              data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[6]);
      this.tomorrow = processDay(data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[1],
                              data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[4],
                              data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[7]);
      this.dayAfter = processDay(data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[2],
                              data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[5],
                              data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[8]);

      this.confidence =  data.bulletinResultsOf.BulletinMeasurements.bulletinConfidence.Components.confidenceLevel;
      this.validTime =  this.validTime = { issued  : data.validTime.TimePeriod.beginPosition.replace("T"," ").split(".")[0] ,
                         expires : data.validTime.TimePeriod.endPosition.replace("T"," ").split(".")[0] };

      this.avSummary = stringCleaner(data.bulletinResultsOf.BulletinMeasurements.avActivityComment);
      this.snowPackSummary = stringCleaner(data.bulletinResultsOf.BulletinMeasurements.snowpackStructureComment);
      this.weatherSummary =  stringCleaner(data.bulletinResultsOf.BulletinMeasurements.wxSynopsisComment);   

      this.avyProblems =  ProblemList();

      function ProblemList (){

         var result = [];

         if (data.bulletinResultsOf.BulletinMeasurements.avProblems_asArray.length > 1)
         {
            var problemList = data.bulletinResultsOf.BulletinMeasurements.avProblems.AvProblem_asArray;
            var size = problemList.length;
            for (var i = 0; i < size; ++i)
            {
               result[i] = processProblem(problemList[i]);
            }
         }
         return result;
         //! \todo assert result.size = problemList.size
      }
      
      function processProblem(problem)
      {
         
         var liklihoodAsInt = {
            "unlikely" : 1,
            "Unlikely-Possible" : 2,
            "Possible" : 3,
            "Possible-Likely":4,
            "Likely":5,
            "Likely-Very Likely":6,
            "Very Likely":7,
            "Very Likely-Certain":8,
            "Certain" : 9 
         }

         return{
            elevationImg : "img/Elevation/Elevation-" + stringBuilder(problem.validElevation_asArray, '_xlink:href', elevationRange) + "_EN.png",
            aspectImg : "img/Compass/compass-" + stringBuilder(problem.validAspect_asArray, '_xlink:href', aspectRange) + "_EN.png",
            liklihoodImg : "img/Likelihood/Likelihood-" + liklihoodAsInt[problem.likelihoodOfTriggering.Values.typical] + "_EN.png",
            sizeImg : "img/Size/Size-" + (problem.expectedAvSize.Values.min | 0) + "-"+ (problem.expectedAvSize.Values.max | 0) + "_EN.png" ,
            probType: problem.type,
            comment : stringCleaner(problem.comment),
            advisoryComment: stringCleaner(problem.travelAdvisoryComment) //! this was previoulsy an array, is there really ever more than one of these ?

            //avProblem.travelAdvisoryComment_asArray
         }
      }
      
      function processDay(dayAlp, dayTln, dayBtl)
      {
         //! \todo assert dayAlp is for today
         var alpine = dayAlp.customData.DangerRatingDisplay.mainLabel ;
         var alpineClass = (alpine  == "No Rating") ? "none" : alpine.toLowerCase();
         var treeline = dayTln.customData.DangerRatingDisplay.mainLabel ;
         var treelineClass = (treeline  == "No Rating") ? "none" : treeline.toLowerCase();
         var belowTreeline = dayBtl.customData.DangerRatingDisplay.mainLabel ;
         var belowTreelineClass = (belowTreeline  == "No Rating") ? "none" : belowTreeline.toLowerCase();
         return {
            day: weekdays[new Date(dayAlp.validTime.TimeInstant.timePosition).getDay()],
            alpine: {text: alpine, css: alpineClass},
            treeline: {text: treeline, css: treelineClass},
            belowTreeline: {text: belowTreeline, css: belowTreelineClass}
         }
      };
   }

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
		
   return {

	   get: function (region)
	   {
         var defer = $q.defer();
		  
         //! Get the file for the region from HTTP as xml convert to json
         function getFromHttp () {

            var url = RegionDefinition.getUrl(region);

   	  		Data.httpGetXml(url, transform).then(
				 function (data) // get from http succeeded
				 {
					 //! Got Data from HTTP save to file {
					 console.log("received data from http");
                console.log(data);
                
                 if (data != null && typeof data != 'undefined')
                 {
                      var forecast = "";


                      if ( RegionDefinition.get()[region].type === 'cac' )
                      {
                        forecast = new CacData(data);
                      }
                      else if ( RegionDefinition.get()[region].type === 'parks' )
                      {
                        forecast = new ParksData(data);
                      }
                      else
                      {
                        alert('unsuported region');
                      }

                         defer.resolve(forecast);               
            
                  }
                  else
                  {
                     defer.reject("Null Data");
                  }
                //data.CaamlData.observations.Bulletin
                //var forecast =  
					 //! }

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










   