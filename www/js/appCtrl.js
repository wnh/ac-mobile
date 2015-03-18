angular.module('acMobile.controllers')
    .controller('AppCtrl', function($scope, acUser, acMin) {
        $scope.user = acUser;

        $scope.isDataStored = acMin.draftReports.length || acMin.submittedReports.length;
        $scope.resetStorage = function() {
            adMin.purgeStoredData();
        }
    });
