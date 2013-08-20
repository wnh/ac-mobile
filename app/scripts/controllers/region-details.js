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
                         $scope.today = data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[0];
                         $scope.today.day = weekdays[new Date($scope.today.validTime.TimeInstant.timePosition.__text).getDay()]
                         $scope.tomorrow = data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[1];
                         $scope.tomorrow.day = weekdays[new Date($scope.tomorrow.validTime.TimeInstant.timePosition.__text).getDay()]
                         $scope.dayAfter = data.bulletinResultsOf.BulletinMeasurements.dangerRatings.DangerRating_asArray[2];
                         $scope.dayAfter.day = weekdays[new Date($scope.dayAfter.validTime.TimeInstant.timePosition.__text).getDay()]
                         $scope.confidence = data.bulletinResultsOf.BulletinMeasurements.bulletinConfidence.Components.confidenceLevel;

                         $scope.valid = data.validTime.TimePeriod; //! valid.beginPosition.__text | valid.endPosition.__text 
                         $scope.valid.issued = $scope.valid.beginPosition.__text.replace("T"," ")
                         $scope.valid.expires = $scope.valid.endPosition.__text.replace("T"," ")
                                         
                    },
                    function(error){
                        console.error('error getting forecast', error);
                    }
                    
            );
    } // end function getForecast
    
    $scope.region = $routeParams.region;
    getForecast();
    


  });
