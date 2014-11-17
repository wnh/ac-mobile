angular.module('acMobile.controllers')
    .controller('ForecastsMapCtrl', function($scope, $timeout, acForecast, resForecasts) {
        $scope.current = {
            region: {}
        };
        $scope.drawer = {
            visible: false
        };

        //acForecast.fetch().then(function(forecasts) {
        $scope.regions = resForecasts;
        console.log($scope.regions);
        //});

        $scope.$watch('current.region', function(newRegion, oldRegion) {
            if (newRegion && newRegion !== oldRegion) {
                console.log(newRegion);
                $scope.drawer.visible = false;
                $scope.imageLoaded = false;

                if (!newRegion.feature.properties.forecast) {
                    acForecast.getOne(newRegion.feature.id).then(function(forecast) {
                        newRegion.feature.properties.forecast = forecast;
                    });
                }

                $timeout(function() {
                    $scope.drawer.visible = true;
                }, 800);
            }
        });
    });
