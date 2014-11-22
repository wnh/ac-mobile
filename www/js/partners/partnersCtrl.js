angular.module('acMobile.controllers')
    .controller('PartnersCtrl', function($scope, acPartnerLaunch) {
        $scope.launchTecterra = function(link) {
            console.log("here");
            acPartnerLaunch.tecterra(link);
        };
        $scope.launchMec = function(link) {
            console.log("here2");
            acPartnerLaunch.mec(link);
        };
    });
