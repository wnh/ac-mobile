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
        $scope.status = {};
        $scope.status.isOnline = $cordovaNetwork.isOnline();


        $scope.submit = function(item) {
            //submit the report, flag it as complete.
            //when complete, reload the reports.

            //if ($cordovaNetwork.isOnline()) {
            if ($scope.status.isOnline) {
                item.submitting = true;
                acMin.sendReport(item)
                    .then(function(result) {
                        $timeout(function() {
                            item.submitting = false;
                        }, 5000);
                        console.log(result);
                    });

            } else {
                //we're now offline - cannot submit, do nothing!
            }
        };



        $scope.showShare = function(item) {
            if ($scope.status.isOnline) {
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
            }
        };


    });