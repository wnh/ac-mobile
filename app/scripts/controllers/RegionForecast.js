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


    //! Problems Modal {
    $scope.openDangerScale = function (dangerRating) {

      var DangerScaleModal = $modal.open({
        templateUrl: 'DangerScaleModal.html',
        controller: DangerScaleModalCtrl,
        resolve: {
          dangerRating: function () {
            return dangerRating;
          }
        }
      });
    };

    var DangerScaleModalCtrl = ['$scope', '$modalInstance', 'dangerRating', function ($scope, $modalInstance, dangerRating) {

      $scope.extremeOpen = dangerRating == "Extreme" ? true : false;
      $scope.highOpen = dangerRating == "High" ? true : false;
      $scope.considerableOpen = dangerRating == "Considerable" ? true : false;
      $scope.moderateOpen = dangerRating == "Moderate" ? true : false;
      $scope.lowOpen = dangerRating == "Low" ? true : false;

      $scope.ok = function () {
        $modalInstance.close();
      };

    }];

    /*
    //! Problems Modal {
    $scope.openProblem = function (avProblem) {

      var ProblemsModalInstance = $modal.open({
        templateUrl: 'ForecastProblemsModal.html',
        controller: ProblemsModalCtrl,
        resolve: {
          avProblem: function () {
            return avProblem;
          }
        }
      });
    };

    var ProblemsModalCtrl = ['$scope', '$modalInstance', 'avProblem', function ($scope, $modalInstance, avProblem) {

      $scope.avProblem = avProblem;

      $scope.ok = function () {
        $modalInstance.close();
      };

    }];*/
    //! } // End Problems Modal

/*

    //! Forecast Details Modal {
    $scope.openDetails = function () {

      var DetailsModalInstance = $modal.open({
        templateUrl: '/views/ForecastDetailsModal.html',
        controller: DetailsModalCtrl,
        resolve: {
          forecastDetails: function () {
            return forecastDetails;
          }
        }
      });
    };

    var DetailsModalCtrl = ['$scope', '$modalInstance', 'forecastDetails', function ($scope, $modalInstance, forecastDetails) {

      $scope.av = forecastDetails.avSummary;
      $scope.snowPack = forecastDetails.snowPackSummary;
      $scope.weather =  forecastDetails.weatherSummary;

      $scope.ok = function () {
        $modalInstance.close();
      };

    }];
    //! } // End Forecast Modal

    //! Danger Scale Modal {
    $scope.openDetails = function () {

      var DetailsModalInstance = $modal.open({
        templateUrl: '/views/ForecastDetailsModal.html',
        controller: DetailsModalCtrl,
        resolve: {
          forecastDetails: function () {
            return forecastDetails;
          }
        }
      });
    };

    var DetailsModalCtrl = ['$scope', '$modalInstance', 'forecastDetails', function ($scope, $modalInstance, forecastDetails) {

      $scope.av = forecastDetails.avSummary;
      $scope.snowPack = forecastDetails.snowPackSummary;
      $scope.weather =  forecastDetails.weatherSummary;

      $scope.ok = function () {
        $modalInstance.close();
      };

    }];
    //! } // End Forecast Modal

  */



  });
