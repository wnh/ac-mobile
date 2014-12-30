angular.module('acMobile.controllers')
    .controller('AppCtrl', function($scope, acUser) {
        $scope.user = acUser;
    });