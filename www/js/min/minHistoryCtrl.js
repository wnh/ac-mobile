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

        $scope.draftReports = acMin.draftReports;
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
                    text: '<b>Submit Report</b>'
                }, {
                    text: 'Edit Report'
                }];
            } else {
                availableButtons = [{
                    text: 'Edit Report'
                }];

            }
            var hideSheet = $ionicActionSheet.show({
                titleText: "Draft Report",
                buttons: availableButtons,
                destructiveText: 'Delete Report',
                cancelText: "Cancel",
                buttonClicked: function(index) {
                    if ($scope.status.isOnline) {
                        if (index === 0) {
                            hideSheet();
                            confirmSubmit(item);
                        } else if (index === 1) {
                            var idx = _.indexOf($scope.draftReports, item);
                            $state.go('app.min', {
                                index: idx
                            });
                            return true;
                        }
                    } else {
                        if (index === 0) {
                            var idx = _.indexOf($scope.draftReports, item);
                            $state.go('app.min', {
                                index: idx
                            });
                            return true;
                        }
                    }
                },
                destructiveButtonClicked: function() {
                    confirmDelete(item);
                    return true;
                },
                cancelButtonClicked: function() {
                    console.log('cancel');
                    return true;
                }
            });
        };

        function confirmDelete(item) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Report',
                template: 'Are you sure you want to delete the report?',
                cancelType: 'button-outline button-energized',
                okType: 'button-energized',
                okText: 'Yes',
                cancelText: 'No'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    acMin.delete(item);
                }
            });
        }

        function confirmSubmit(item) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Submit Report',
                template: 'Are you sure you want to submit the report?',
                cancelType: 'button-outline button-energized',
                okType: 'button-energized',
                okText: 'Yes',
                cancelText: 'No'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $scope.submit(item);
                }
            });
        }

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
