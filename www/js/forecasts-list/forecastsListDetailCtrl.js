angular.module('acMobile.controllers')
    .controller('ForecastsListDetailCtrl', function($scope, $timeout, $ionicScrollDelegate, $stateParams, forecast) {
        console.log(forecast);
        $scope.forecast = forecast;

        $scope.resize = function() {
            //ac-components is built using bootstrap which doesn't have a tap/click handler to elimninate the 300ms
            //click delay on mobile devices. So we have to let the 300ms delay expire and then resize to ensure the
            //content of the div is shown onscreen.
            $timeout(function() {
                $ionicScrollDelegate.resize();
            }, 310);
        };


    });
