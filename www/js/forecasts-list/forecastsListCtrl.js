angular.module('acMobile.controllers')
    .controller('ForecastsListCtrl', function($scope, acForecast, acPromiseTimeout, $ionicPlatform, $ionicLoading, $cordovaNetwork, AC_API_ROOT_URL) {

        $scope.rootUrl = AC_API_ROOT_URL;
        $scope.status = {
            isOnline: true
        };

        function resolveData() {
            return acForecast.fetch();
        }

        $ionicPlatform.ready().then(function() {
            $scope.status.isOnline = $cordovaNetwork.isOnline();
            if ($scope.status.isOnline) {
                $ionicLoading.show({
                    template: '<i class="fa fa-circle-o-notch fa-spin"></i> Loading'
                });
                var promTime = new acPromiseTimeout();
                promTime.start(resolveData, [], 10000)
                    .then(function(results) {
                        $scope.regions = results;
                        $ionicLoading.hide();
                    }, function(error) {
                        console.log(error);
                        $scope.status.isOnline = false;
                        $ionicLoading.hide();
                    });
            }
        });

    });
