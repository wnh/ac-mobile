angular.module('acMobile.controllers')
    .controller('ForecastsMapCtrl', function($scope, $timeout, acForecast, forecasts, obs, $ionicScrollDelegate) {
        angular.extend($scope, {
            current: {},
            drawer: {
                visible: false
            },
            regions: forecasts,
            obs: obs
        });

        $scope.resize = function() {
            //ac-components is built using bootstrap which doesn't have a tap/click handler to elimninate the 300ms
            //click delay on mobile devices. So we have to let the 300ms delay expire and then resize to ensure the
            //content of the div is shown onscreen.
            $timeout(function() {
                $ionicScrollDelegate.resize();
            }, 310);
        };

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