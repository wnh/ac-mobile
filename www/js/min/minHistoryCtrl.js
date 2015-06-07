angular.module('acMobile.controllers')
    .filter('timeAgo', function() {
        return function(date) {
            var today = moment();
            var reportDate = moment(new Date(date));
            if (today.diff(reportDate, 'days') < 7) {
                return reportDate.fromNow();
            } else {
                return reportDate.format('MM-DD-YYYY hh:mm a');
            }
        };
    })
    .controller('MinHistoryCtrl', function(store, $state, $q, $scope, $window, $timeout, acMin, acMobileSocialShare, $ionicActionSheet, $cordovaGoogleAnalytics, $ionicPopup, $cordovaNetwork, $ionicLoading, $ionicPlatform) {
        var shareMessage = "Check out my Mountain Information Network Report: ";

        $scope.draftReports = acMin.draftReports;
        $scope.submittedReports = acMin.submittedReports;

        $scope.status = {};
        $ionicPlatform.ready().then(function() {
            $timeout(function() {
                $scope.status.isOnline = $cordovaNetwork.isOnline();
            }, 0);
        });

        $scope.submit = function(item) {
            item.report.datetime = moment(item.report.datetime).format(); //sets right format for submission
            acMin.sendReport(item)
                .then(function(result) {
                    if ($window.analytics) {
                        $cordovaGoogleAnalytics.trackEvent('MIN', 'Quick Report Submit', 'submitted', '1');
                    }
                    globalSubmitting = false;
                })
                .catch(function(error) {
                    console.log(error);
                    return $q.reject(error);
                });
        };

        $scope.showPendingActionSheet = function(item) {
            if (!item.submitting) {
                var availableButtons = [];
                if ($scope.status.isOnline) {
                    availableButtons = [{
                        text: '<b>Submit</b>'
                    }, {
                        text: 'Edit'
                    }, {
                        text: 'Delete'
                    }];
                } else {
                    availableButtons = [{
                        text: 'Edit'
                    }, {
                        text: 'Delete'
                    }];

                }
                var hideSheet = $ionicActionSheet.show({
                    //titleText: "Draft Report",
                    buttons: availableButtons,
                    //destructiveText: 'Delete',
                    cancelText: "Cancel",
                    buttonClicked: function(index) {
                        if ($scope.status.isOnline) {
                            if (index === 0) {
                                hideSheet();
                                if (acMin.globalSubmitting === true) {
                                    $ionicLoading.show({
                                        template: 'You can only submit one report at a time',
                                        duration: 2000
                                    });
                                } else {
                                    confirmSubmit(item);
                                }
                            } else if (index === 1) {
                                var idx = _.indexOf($scope.draftReports, item);
                                $state.go('app.min', {
                                    index: idx
                                });
                                return true;
                            } else if (index === 2) {
                                confirmDelete(item);
                                return true;
                            }
                        } else {
                            if (index === 0) {
                                var idx = _.indexOf($scope.draftReports, item);
                                $state.go('app.min', {
                                    index: idx
                                });
                                return true;
                            } else if (index === 1) {
                                confirmDelete(item);
                                return true;
                            }
                        }
                    },
                    destructiveButtonClicked: function() {
                        confirmDelete(item);
                        return true;
                    },
                    cancelButtonClicked: function() {
                        return true;
                    }
                });
            } else {
                $ionicLoading.show({
                    template: 'This report is currently being submitted',
                    duration: 2500
                });
            }
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
            if (!item.report.latlng.length) {
                $ionicLoading.show({
                    template: '<i class="fa fa-map-marker"></i> Location Missing<br/>Please edit the report and add location before submitting',
                    duration: 2500
                });

            } else {
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
        }

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
                        $cordovaGoogleAnalytics.trackEvent('MIN', 'Quick Report Share', provider, '1');
                    }
                }
            });
        };
    });
