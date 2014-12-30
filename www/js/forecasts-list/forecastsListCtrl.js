angular.module('acMobile.controllers')
    .controller('ForecastsListCtrl', function($scope, acForecast, AC_API_ROOT_URL) {
        $scope.rootUrl = AC_API_ROOT_URL;
        acForecast.fetch().then(function(forecasts) {
            $scope.regions = forecasts;
        });
    });