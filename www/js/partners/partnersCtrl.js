angular.module('acMobile.controllers')
    .controller('PartnersCtrl', function($scope, acPartnerLaunch) {
        $scope.launchTecterra = function(link) {
            acPartnerLaunch.tecterra(link);
        };
        $scope.launchMec = function(link) {
            acPartnerLaunch.mec(link);
        };
    });
