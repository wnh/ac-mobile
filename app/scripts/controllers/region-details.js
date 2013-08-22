'use strict';

angular.module('CACMobile')
  .controller('RegionDetailsCtrl', function ($scope, $routeParams, Forecast) {

    function getForecast() {    
        Forecast.get($scope.region).then(
                    function(data){
                        var weekdays = new Array(7);
                        weekdays[0] = "Sunday";
                        weekdays[1] = "Monday";
                        weekdays[2] = "Tuesday";
                        weekdays[3] = "Wednesday";
                        weekdays[4] = "Thursday";
                        weekdays[5] = "Friday";
                        weekdays[6] = "Saturday";
                         //data = data_;
                         //$scope.data = data;

                         //! \todo assumes ordered list and assumes recent  checks against the dates should be made her instead of assuming that bulletin has been published !
                         var today = data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[0];
                         var tomorrow = data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[1];
                         var dayAfter = data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[2];

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
                         $scope.today = processDay(today)
                         $scope.tomorrow = processDay(tomorrow)
                         $scope.dayAfter = processDay(dayAfter)
                         $scope.confidence = data.bulletinResultsOf.BulletinMeasurements.bulletinConfidence.Components.confidenceLevel;

                         $scope.valid = data.validTime.TimePeriod; //! valid.beginPosition.__text | valid.endPosition.__text 
                         $scope.valid.issued = $scope.valid.beginPosition.__text.replace("T"," ");
                         $scope.valid.expires = $scope.valid.endPosition.__text.replace("T"," ");
                                         
                    },
                    function(error){
                        console.error('error getting forecast', error);
                    }
                    
            );
    } // end function getForecast
    
    $scope.region = $routeParams.region;
    getForecast();
    


  });
