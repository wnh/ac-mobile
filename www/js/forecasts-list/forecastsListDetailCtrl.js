angular.module('acMobile.controllers')
    .controller('ForecastsListDetailCtrl', function($scope, $timeout, $stateParams, forecast) {
        console.log(forecast);
        $scope.forecast = forecast;

    });
