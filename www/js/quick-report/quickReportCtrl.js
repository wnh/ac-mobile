angular.module('acMobile.controllers')
    .controller('QuickReportCtrl', function($scope) {
        //var dateTime =
        $scope.report = {
            title: "",
            date: "",
            time: "",
            location: "",
            ridingInfo: "",
            avalancheCondtions: {
                'slab': false,
                'sound': false,
                'snow': false,
                'temp': false
            },
            comments: ""
        };

        $scope.checkData = function() {
            console.log($scope.report);
        };
    });
