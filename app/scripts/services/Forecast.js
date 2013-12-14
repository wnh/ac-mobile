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
         var problemList = data.bulletinResultsOf.BulletinMeasurements.avProblems.avProblem_asArray;

         // Need to check that avProblem_asArray is defined, because if it isn't we can't call length on it
         if (problemList)
         {
           if (problemList.length > 0)
           {
              var size = problemList.length;
              for (var i = 0; i < size; ++i)
              {
                 result[i] = processProblem(problemList[i]);
              }
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
         var minSize = parseInt(problem.expectedAvSize.Values.min.__text) + 2;
         var maxSize = parseInt(problem.expectedAvSize.Values.max.__text) + 1;
         return{
            elevationImg : "img/Elevation/Elevation-" + stringBuilder(problem.validElevation_asArray, '_xlink:href', elevationRange) + "_EN.png",
            aspectImg : "img/Compass/compass-" + stringBuilder(problem.validAspect_asArray, '_xlink:href', aspectRange) + "_EN.png",
            liklihoodImg : "img/Likelihood/Likelihood-" + problem.likelihoodOfTriggering.Values.typical.__text + "_EN.png",
            sizeImg : "img/Size/Size-" + minSize + "-"+ maxSize + "_EN.png" ,
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
      // Check if confidence rating exists. If not, then the type of this.confidence will be object, not string. In this case, set the confidence level to be blank
      if (jQuery.type(this.confidence) != "string") {
        this.confidence = "";
      }
      this.validTime =  this.validTime = { issued  : data.validTime.TimePeriod.beginPosition.replace("T"," ").split(".")[0] ,
                         expires : data.validTime.TimePeriod.endPosition.replace("T"," ").split(".")[0] };

      this.avSummary = stringCleaner(data.bulletinResultsOf.BulletinMeasurements.avActivityComment);
      this.snowPackSummary = stringCleaner(data.bulletinResultsOf.BulletinMeasurements.snowpackStructureComment);
      this.weatherSummary =  stringCleaner(data.bulletinResultsOf.BulletinMeasurements.wxSynopsisComment);   

      this.avyProblems =  ProblemList();

      function ProblemList (){

         var result = [];
         var problemList = data.bulletinResultsOf.BulletinMeasurements.avProblems.AvProblem_asArray;
            
         if (problemList) {
           if (problemList.length > 0)
           {
              var size = problemList.length;
              for (var i = 0; i < size; ++i)
              {
                 result[i] = processProblem(problemList[i]);
              }
           }
         }

         return result;
         //! \todo assert result.size = problemList.size
      }
      
      function processProblem(problem)
      {
         
         var liklihoodAsInt = {
            "Unlikely" : 1,
            "Possible - Unlikely" : 2,
            "Possible" : 3,
            "Likely - Possible" : 4,
            "Likely" : 5,
            "Very Likely - Likely" : 6,
            "Very Likely" : 7,
            "Certain - Very Likely" : 8,
            "Certain" : 9 
         }

         var sizeAsAvalx = {
          "0.0" : 0,
          "0.5" : 0,
          "1.0" : 1,
          "1.5" : 2,
          "2.0" : 3,
          "2.5" : 4,
          "3.0" : 5,
          "3.5" : 6,
          "4.0" : 7,
          "4.5" : 8,
          "5.0" : 9,
         }

         var minSize = sizeAsAvalx[problem.expectedAvSize.Values.min] + 2;
         var maxSize = sizeAsAvalx[problem.expectedAvSize.Values.max] + 1;
         return{
            elevationImg : "img/Elevation/Elevation-" + stringBuilder(problem.validElevation_asArray, '_xlink:href', elevationRange) + "_EN.png",
            aspectImg : "img/Compass/compass-" + stringBuilder(problem.validAspect_asArray, '_xlink:href', aspectRange) + "_EN.png",
            liklihoodImg : "img/Likelihood/Likelihood-" + liklihoodAsInt[problem.likelihoodOfTriggering.Values.typical] + "_EN.png",
            sizeImg : "img/Size/Size-" + minSize + "-"+ maxSize + "_EN.png" ,
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
         var date = new Date(dayAlp.validTime.TimeInstant.timePosition);
         // Parks sets regions from 5pm one one day til 5pm the next, so we need to add a day to get the correct date
         date.setDate(date.getDate()+1);
         return {
            day: weekdays[date.getDay()],
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
         var errorCount  = 0;
		  
         //! Get the file for the region from HTTP as xml convert to json
         function getFromHttp () {

            var url = RegionDefinition.getUrl(region);
   	  		Data.httpGetXml(url, transform).then(
				 function (data) // get from http succeeded
				 {
					 //! Got Data from HTTP save to file {
            console.log("received data from http");
            //console.log(data);
            var validResponse = false; 
            var forecast = "";
            if (data != null && typeof data != 'undefined')
            {
              if ( RegionDefinition.get()[region].type === 'cac' )
              {
                if (data.ObsCollection != null && typeof data.ObsCollection != 'undefined') {
                  forecast = new CacData(data);
                  validResponse = true;
                } else {
                  console.error("Unexpected data format for CacData");
                }
              }
              else if ( RegionDefinition.get()[region].type === 'parks' )
              {
                if (data.CaamlData != null && typeof data.CaamlData != 'undefined') {
                  forecast = new ParksData(data);
                  validResponse = true;
                } else {
                  console.error("Unexpected data format for ParksData");
                }
              }
              else
              {
                console.error('unsupported region');
              }   
            }

                              
            if (validResponse) 
            {
              defer.resolve(forecast);
            } 
            else 
            {
              errorCount ++;
              console.error("invalid data");

              if (errorCount < 2)
              {
                getFromHttp();
              }
              else
              {
                defer.reject("Invalid Response To many Retries");
              }
                
            }
                
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










   