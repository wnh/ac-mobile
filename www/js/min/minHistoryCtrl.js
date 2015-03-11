angular.module('acMobile.controllers')
    .filter('timeAgo', function() {
        return function(date) {
            var today = moment();
            var reportDate = moment(date);
            if (today.diff(reportDate, 'days') < 7) {
                return reportDate.fromNow();
            } else {
                return reportDate.format('MM-DD-YYYY hh:mm a');
            }
        };
    })
    .controller('MinHistoryCtrl', function(store, $q, $scope, $timeout, acMin, acMobileSocialShare, $cordovaGoogleAnalytics, $ionicPopup, $cordovaNetwork) {
        var shareMessage = "Check out my Mountain Information Network Report: ";

        $scope.savedReports = acMin.queue;
        $scope.submittedReports = acMin.submittedReports;
        console.log('reports:');
        console.log($scope.savedReports);
        console.log($scope.submittedReports);
        $scope.status = {};
        $scope.status.isOnline = $cordovaNetwork.isOnline();


        $scope.submit = function(item) {
            if ($cordovaNetwork.isOnline()) {

            } else {
                //we're now offline - cannot submit, notify

            }


            // if (!auth.isAuthenticated) {
            //     var token = store.get('token');
            //     var refreshToken = store.get('refreshToken');
            //     if (token) {
            //         if (!jwtHelper.isTokenExpired(token)) {
            //             auth.authenticate(store.get('profile'), token).then(function() {
            //                 $rootScope.$broadcast('userLoggedIn');
            //             });

            //         }
            //     }
            // }


            item.submitting = true;
            acMin.sendReport(item)
                .then(function(result) {
                    item.submitting = false;
                    console.log('all done');
                    console.log(result);
                });
            //submit the report, flag it as complete.
            //when complete, reload the reports.
        };



        $scope.showShare = function(item) {
            $scope.sharePopup = $ionicPopup.show({
                templateUrl: 'templates/post-share.html ',
                title: "Share Observations",
                subTitle: "Share your MIN report",
                scope: $scope
            });
            $scope.sharePopup.then(function(provider) {
                if (provider) {
                    acMobileSocialShare.share(provider, item.report.shareUrl, shareMessage, null);
                    if ($window.analytics) {
                        //      $cordovaGoogleAnalytics.trackEvent('MIN', 'Quick Report Share', provider, '1');
                    }
                }
            });
        };


    });