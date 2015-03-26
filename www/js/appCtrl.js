angular.module('acMobile.controllers')
    .controller('AppCtrl', function($scope, acUser, acMin) {
        $scope.user = acUser;
    });
