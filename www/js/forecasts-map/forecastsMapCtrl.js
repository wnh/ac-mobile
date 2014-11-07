angular.module('acMobile.controllers')
    .controller('ForecastsMapCtrl', function($scope, $timeout, acForecast) {
        $scope.current = {
            region: {}
        };
        $scope.drawer = {
            visible: true
        };

        acForecast.fetch().then(function(forecasts) {
            $scope.regions = forecasts;
        });

        $scope.$watch('current.region', function(newRegion, oldRegion) {
            if (newRegion && newRegion !== oldRegion) {
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
