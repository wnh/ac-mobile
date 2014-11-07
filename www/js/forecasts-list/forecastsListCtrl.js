angular.module('acMobile.controllers')
    .controller('ForecastsListCtrl', function($scope, $timeout, acForecast) {

        acForecast.fetch().then(function(forecasts) {
            $scope.regions = forecasts;
        });
    });
