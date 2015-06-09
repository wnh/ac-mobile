angular.module('acMobile.controllers')
    .controller('ForecastsListDetailCtrl', function($scope, $timeout, $ionicScrollDelegate, $stateParams, $ionicPlatform, $ionicLoading, acPromiseTimeout, $cordovaNetwork, acForecast) {

        $scope.status = {
            isOnline: true
        };

        function resolveData() {
            return acForecast.getOne($stateParams.id);
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
                        $scope.forecast = results;
                        $ionicLoading.hide();
                    }, function(error) {
                        console.log(error);
                        $scope.status.isOnline = false;
                        $ionicLoading.hide();
                    });
            }
        });



        $scope.resize = function() {
            //ac-components is built using bootstrap which doesn't have a tap/click handler to elimninate the 300ms
            //click delay on mobile devices. So we have to let the 300ms delay expire and then resize to ensure the
            //content of the div is shown onscreen.
            $timeout(function() {
                $ionicScrollDelegate.resize();
            }, 0);
        };


    });
