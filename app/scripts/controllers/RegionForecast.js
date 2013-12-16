'use strict';

angular.module('CACMobile')
  .controller('RegionForecastCtrl', function ($scope, $routeParams, $location, $log, $modal, Forecast, Data, RegionDefinition) {
    $scope.loading = true;
    $scope.region = null;
    $scope.regionExists = true;

    //! var used for ForecastDetails
    //var forecastDetails = {'avSummary':null, 'snowPack':null, 'weather':null};

    //! vars used for problems
    //var foercastProblems = {'avyProblems':null};

    function getForecast() {
        Forecast.get($scope.region).then(
                    function(fx){

                         $scope.loading = false;

                         $scope.today = fx.today;
                         $scope.tomorrow = fx.tomorrow;
                         $scope.dayAfter = fx.dayAfter;
                         $scope.confidence = fx.confidence;

                         $scope.valid = { issued : fx.validTime.issued,
                                          expires : fx.validTime.expires}

                        var regions = RegionDefinition.get();
                        $scope.regionDisplayName = regions[$scope.region].display;

                        //! ForecastDetails
                        $scope.avSummary = fx.avSummary;
                        $scope.snowPack = fx.snowPackSummary;
                        $scope.weather =  fx.weatherSummary;

                        //! problems
                        $scope.avyProblems = fx.avyProblems;

                    },
                    function(error){
                        $log.error('error getting forecast', error);
                    }

            );
    } // end function getForecast


    if (RegionDefinition.exists($routeParams.region) === true)
    {
      $scope.region = $routeParams.region;
      $scope.regionExists = true;
      getForecast();
    }
    else
    {
      $scope.regionExists = false;
    }

    $scope.back = function () {
      window.history.back();
    }

    $scope.openProblem = function (index) {
      alert(index);
    };

  $scope.tabs =  {'forecast': false, 'problems': false, 'details': false, 'dangerScale': false};

  $scope.openDangerScale = function (dangerRating) {

    $scope.extremeOpen = dangerRating == "Extreme" ? true : false;
    $scope.highOpen = dangerRating == "High" ? true : false;
    $scope.considerableOpen = dangerRating == "Considerable" ? true : false;
    $scope.moderateOpen = dangerRating == "Moderate" ? true : false;
    $scope.lowOpen = dangerRating == "Low" ? true : false;

    $scope.tabs.dangerScale = true;
  }

});
