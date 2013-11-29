'use strict';

angular.module('CACMobile')
  .controller('RegionDetailsCtrl', function ($scope, $routeParams, $location, Forecast, Data, RegionDefinition) {
    $scope.loading = true;
    $scope.region = null;
    $scope.visible = false;

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

                    },
                    function(error){
                        console.error('error getting forecast', error);
                    }

            );
    } // end function getForecast


    if (RegionDefinition.exists($routeParams.region) === true)
    {
      $scope.region = $routeParams.region;
      $scope.visible = true;
      getForecast();

    }

  });
