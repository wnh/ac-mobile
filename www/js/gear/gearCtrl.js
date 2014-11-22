angular.module('acMobile.controllers')
    .controller('GearCtrl', function($scope, gearData, acPartnerLaunch) {
        $scope.gearItems = gearData.gearItems;
        $scope.gearDisplayed = "";

        $scope.isGearDisplayed = function(gearItem) {
            return $scope.gearDisplayed === gearItem.heading;
        };

        $scope.openSection = function(gearItem) {
            if ($scope.gearDisplayed === gearItem.heading) {
                //close all
                $scope.gearDisplayed = "";
            } else {
                $scope.gearDisplayed = gearItem.heading;
            }
        };

        $scope.launchMec = function(link) {
            acPartnerLaunch.mec(link);
        };


    });
