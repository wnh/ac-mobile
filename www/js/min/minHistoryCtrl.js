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
    .controller('MinHistoryCtrl', function(store, $state, $q, $scope, $timeout, acMin, acMobileSocialShare, $ionicActionSheet, $cordovaGoogleAnalytics, $ionicPopup, $cordovaNetwork) {
        var shareMessage = "Check out my Mountain Information Network Report: ";

        $scope.pendingReports = acMin.pendingReports;
        $scope.submittedReports = acMin.submittedReports;
        $scope.status = {};
        $scope.status.isOnline = $cordovaNetwork.isOnline();


        $scope.submit = function(item) {
            acMin.sendReport(item)
                .then(function(result) {
                    console.log(result);
                });
        };

        $scope.showPendingActionSheet = function(item) {
            var availableButtons = [];
            if ($scope.status.isOnline) {
                availableButtons = [{
                    text: '<b><i class="icon fa fa-cloud-upload"></i> Submit</b>'
                }, {
                    text: '<i class="icon ion-edit"></i> Edit'
                }];
            } else {
                availableButtons = [{
                    text: '<i class="icon ion-edit"></i> Edit'
                }];

            }
            var hideSheet = $ionicActionSheet.show({
                titleText: "Pending Report",
                buttons: availableButtons,
                destructiveText: '<i class="icon ion-trash-b"></i> Delete',
                cancelText: "Cancel",
                buttonClicked: function(index) {
                    if ($scope.status.isOnline) {
                        if (index === 0) {
                            hideSheet();
                            $scope.submit(item);
                        } else if (index === 1) {
                            //hideSheet();
                            //edit
                            var idx = _.indexOf($scope.pendingReports, item);
                            $state.go('app.min', {
                                index: idx
                            });
                        }
                    } else {
                        if (index === 0) {
                            hideSheet();
                            //edit
                        }
                    }
                },
                destructiveButtonClicked: function() {
                    console.log('DESTRUCT');
                    return true;
                },
                cancelButtonClicked: function() {
                    console.log('cancel');
                    return true;
                }
            });
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