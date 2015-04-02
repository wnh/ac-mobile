angular.module('acMobile.services')
    .service('acConnection', function($q, $http, AC_API_ROOT_URL, $cordovaNetwork, $ionicPlatform, $ionicLoading, acForecast, acPromiseTimeout) {
        var self = this;


        function connectionTest() {
            var apiUrl = AC_API_ROOT_URL;
            return $http.get(apiUrl + '/api/forecasts', {cache:false});
        }

        this.check = function() {
            return $ionicPlatform.ready().then(function() {
                var cordovaOnline = $cordovaNetwork.isOnline();
                if (cordovaOnline) {
                    console.log('checking connection quality');
                    $ionicLoading.show({
                        template: '<i class="fa fa-circle-o-notch fa-spin"></i> Checking connection'
                    });
                    var promTime = new acPromiseTimeout();
                    return promTime.start(connectionTest, [], 5000)
                        .then(function(results) {
                            console.log('connection quality good');
                            $ionicLoading.hide();
                            return true;
                        }, function(error) {
                            console.log('connection quality poor');
                            $ionicLoading.hide();
                            return $q.reject(false);
                        });
                } else {
                    console.log('connection quality failed - offline');
                    return $q.reject(false);
                }
            });
        };
    });
