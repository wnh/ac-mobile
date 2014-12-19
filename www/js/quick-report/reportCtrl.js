angular.module('acMobile.controllers')
    .filter('trimLocation', function() {
        return function(string, maxlength) {
            return string.substr(0, maxlength);
        };
    })
    .controller('ReportCtrl', function($scope, $rootScope, $window, auth, store, $q, $timeout, acMobileSocialShare, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicActionSheet, $ionicModal, $cordovaGeolocation, $cordovaNetwork, $cordovaSocialSharing, $cordovaCamera, $cordovaGoogleAnalytics, fileArrayCreator, acOfflineReports, acUser) {

        var Camera = navigator.camera;
        var shareMessage = "Check out my Mountain Information Network Report: ";
        angular.extend($scope, {
            display: {
                'ridingInfo': false,
                'avalancheConditions': false,
                'location': ''
            },
            markerPosition: {
                latlng: [0, 0]
            },
            imageSources: []
        });

        function resetDateTime() {
            $scope.report.datetime = moment().format('YYYY-MM-DDTHH:mm:ss');
            $scope.imageSources = [];
        }
        $timeout(resetDateTime, 0);

        function resetDisplay() {
            $scope.display.ridingInfo = false;
            $scope.display.avalancheConditions = false;
            $timeout(resetDateTime, 0);
        }

        $scope.showLocationSheet = function() {
            if ($cordovaNetwork.isOnline()) {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [{
                        text: "Use my location"
                    }, {
                        text: "Pick position on map"
                    }],
                    titleText: "Report Location",
                    cancelText: "Cancel",
                    buttonClicked: function(index) {
                        if (index === 0) {
                            hideSheet();
                            getLocation();
                        } else if (index === 1) {
                            hideSheet();
                            $scope.locationModal.show();
                        }
                    }
                });
            } else { //offline
                getLocation();
            }

        };

        function getLocation() {
            var options = {
                enableHighAccuracy: true,
                timeout: 240000,
                maximumAge: 0
            };
            return $ionicPlatform.ready()
                .then(function() {
                    if (!$cordovaNetwork.isOnline()) {
                        $scope.display.location = 'Acquiring Position - may take a few minutes';
                    } else {
                        $scope.display.location = 'Acquiring Position';
                    }
                    return $cordovaGeolocation.getCurrentPosition(options);
                })
                .then(function(position) {
                    $scope.display.location = '';
                    $scope.report.latlng = [position.coords.latitude, position.coords.longitude];
                })
                .catch(function(error) {
                    $scope.display.location = '';
                    $ionicLoading.show({
                        template: 'There was a problem getting your position',
                        duration: 3000
                    });
                    console.log(error);
                    return $q.reject(error);
                });
        }


        $ionicModal.fromTemplateUrl('templates/location-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.locationModal = modal;
        });

        $scope.confirmLocation = function() {
            if ($scope.markerPosition.latlng[0] !== 0) {
                $scope.report.latlng = [$scope.markerPosition.latlng[0], $scope.markerPosition.latlng[1]];
                $scope.locationModal.hide();
            } else {
                $ionicLoading.show({
                    duration: 2000,
                    template: '<i class="fa fa-exclamation-triangle"></i> You have not selected a position yet'
                });
            }
        };

        function takePicture(options) {
            return $ionicPlatform.ready()
                .then(function() {
                    return $cordovaCamera.getPicture(options);
                })
                .then(function(imageUrl) {
                    $scope.imageSources.push(imageUrl);
                    return fileArrayCreator.processImage(imageUrl);
                })
                .then(function(fileBlob) {
                    $scope.report.files.push(fileBlob);
                    $ionicLoading.show({
                        duration: 1000,
                        template: '<i class="fa fa-camera"></i> Picture attached'
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });
        }

        $scope.showPictureSheet = function() {
            var options = {};
            var hidePictureSheet = $ionicActionSheet.show({
                buttons: [{
                    text: "Take picture"
                }, {
                    text: "Attach existing picture"
                }],
                titleText: "Add a picture",
                cancelText: "Cancel",
                buttonClicked: function(index) {
                    if (index === 0) {
                        hidePictureSheet();
                        options = {
                            quality: 75,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            allowEdit: false,
                            encodingType: Camera.EncodingType.JPEG,
                            saveToPhotoAlbum: true
                        };
                        takePicture(options);

                    } else if (index === 1) {
                        hidePictureSheet();
                        options = {
                            quality: 75,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit: false,
                            encodingType: Camera.EncodingType.JPEG
                        };
                        takePicture(options);
                    }
                }
            });
        };

        function sharePopup() {
            $scope.sharePopup = $ionicPopup.show({
                templateUrl: 'templates/post-share.html ',
                title: "Observation report saved",
                subTitle: "Share your report",
                scope: $scope
            });
            $scope.sharePopup.then(function(provider) {
                if (provider) {
                    acMobileSocialShare.share(provider, $scope.report.shareUrl, shareMessage, null);
                    if ($window.analytics) {
                        $cordovaGoogleAnalytics.trackEvent('MIN', 'Quick Report Share', provider, '1');
                    }
                }
                $scope.reset();

            });
        }

        $scope.submit = function() {
            if ($cordovaNetwork.isOnline()) {
                if (auth.isAuthenticated) {
                    submitTmpl = '<i class="fa fa-circle-o-notch fa-spin"></i> Sending report';
                    if ($scope.imageSources.length) {
                        submitTmpl = '<i class="fa fa-circle-o-notch fa-spin"></i> Sending report - this may take a few minutes';
                    }
                    $ionicLoading.show({
                        template: submitTmpl,
                        duration: 600000
                    });
                    var errorMsg = '';
                    if (validateReport()) {
                        $scope.submitForm().then(function(result) {
                            $ionicLoading.hide();
                            sharePopup();
                            if ($window.analytics) {
                                $cordovaGoogleAnalytics.trackEvent('MIN', 'Quick Report Submit', 'success', '1');
                            }
                            //attempt bg sync here?
                        }).catch(function(error) {
                            if (angular.isObject(error)) {
                                //api responded w/error
                                if (error.data && error.data.error) {
                                    errorMsg = error.data.error;
                                }
                            } else {
                                //generic error
                                errorMsg = 'There was a problem sending your report';
                            }
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                template: '<i class="fa fa-warning"></i><p>' + errorMsg + '</p>',
                                duration: 4000
                            });
                            if ($window.analytics) {
                                $cordovaGoogleAnalytics.trackEvent('MIN', 'Quick Report Submit', 'failure', '1');
                            }
                        });
                    }
                } else {
                    acUser.prompt("You must be logged in to submit a report");
                }
            } else {
                $ionicLoading.show({
                    duration: 3000,
                    template: '<i class="fa fa-chain-broken"></i> <p>You must be connected to the network to submit. Your report will be submitted when you have a connection.</p>'
                });
                if (validateReport()) {
                    acOfflineReports.push($scope.report, $scope.imageSources);
                    if ($window.analytics) {
                        $cordovaGoogleAnalytics.trackEvent('MIN', 'Quick Report Submit', 'queued', '1');
                    }
                    $scope.reset();
                }
            }
        };

        $scope.reset = function() {
            $scope.resetForm();
            resetDisplay();
        };

        function validateReport() {
            var errors = '';
            if ($scope.report.title.length === 0) {
                errors += 'Please enter a title<br/>';
            }
            if ($scope.report.latlng.length === 0) {
                errors += 'Please specify a location<br/>';
            }
            if ($scope.report.datetime) {
                if (moment($scope.report.datetime).unix() > moment().unix()) {
                    errors += 'Please specify a valid date/time<br/>';
                }
            }
            if (errors.length) {
                $ionicLoading.show({
                    duration: 4000,
                    template: '<div class="form-error"><p><i class="fa fa-warning"></i> There was an error submittting you report:</p>' + errors + "</div>"
                });
                return false;
            }
            return true;
        }

        $scope.$on('$destroy', function() {
            $scope.locationModal.remove();
        });

    });