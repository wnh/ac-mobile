angular.module('acMobile.controllers')
    .filter('trimLocation', function() {
        return function(string, maxlength) {
            return string.substr(0, maxlength);
        };
    })
    .controller('ReportCtrl', function($scope, $stateParams, $state, $rootScope, $window, auth, store, $q, $timeout, acMobileSocialShare, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicActionSheet, $ionicModal, $cordovaGeolocation, $cordovaNetwork, $cordovaSocialSharing, $cordovaCamera, $cordovaGoogleAnalytics, acFileService, acUser, acMin, acQuickReportData, acConnection) {

        //var Camera = navigator.camera;
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
            fileSrcs: []
        });

        var reportTemplate = {
            title: 'auto: Quick Report',
            datetime: new Date(), //now use plain old js date object to satisfy ng-model
            latlng: [],
            files: [],
            ridingConditions: angular.copy(acQuickReportData.ridingConditions),
            avalancheConditions: angular.copy(acQuickReportData.avalancheConditions),
            comment: null
        };




        function resetDateTime() {
            $scope.report.datetime = new Date(); //now use plain old js date object to satisfy ng-model
            $scope.report.title = '';
            $scope.fileSrcs = [];
        }


        function resetDisplay() {
            $scope.display.ridingInfo = false;
            $scope.display.avalancheConditions = false;
            $timeout(resetDateTime, 0);
        }

        if ($stateParams.index) {
            var index = $stateParams.index;
            $scope.report = angular.copy(acMin.draftReports[index].report);
            $scope.report.datetime = new Date($scope.report.datetime);
            $scope.fileSrcs = angular.copy(acMin.draftReports[index].fileSrcs) || [];
        } else {
            $scope.report = angular.copy(reportTemplate);
            $timeout(resetDateTime, 0);
        }

        $scope.resetForm = function() {
            $timeout(function() {
                for (var field in $scope.report) {
                    if (field in reportTemplate) {
                        if (field === 'ridingConditions' || field === 'avalancheConditions') {
                            $scope.report[field] = angular.copy(reportTemplate[field]);
                        } else {
                            $scope.report[field] = reportTemplate[field];
                        }
                    }
                }
                delete $scope.report.subid;
                $scope.minsubmitting = false;
                $scope.minerror = false;
            }, 0);
        };

        $scope.showLocationSheet = function() {
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
                        return getLocation();
                    } else if (index === 1) {
                        hideSheet();
                        return $ionicPlatform.ready()
                            .then(acConnection.check)
                            .then(function(result) {
                                if (result) {
                                    return displayMapModal();
                                } else {
                                    $ionicLoading.show({
                                        template: 'Picking a position on the map requires an internet connection. Please connect to the internet and try again, or save the report and pick your position later.',
                                        duration: 7000
                                    });
                                    return $q.reject(error);
                                }
                            })
                            .catch(function(error) {
                                $ionicLoading.show({
                                    template: 'Picking a position on the map requires an internet connection. Please connect to the internet and try again, or save the report and pick your position later.',
                                    duration: 7000
                                });
                                return $q.reject(error);
                            });
                    }
                }
            });
        };

        function displayMapModal() {
            return $ionicModal.fromTemplateUrl('templates/location-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.locationModal = modal;
                $scope.locationModal.show();
            });

        }

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
                        template: 'There was a problem acquiring your position',
                        duration: 3000
                    });
                    console.log(error);
                    return $q.reject(error);
                });
        }



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
                    $ionicLoading.show({
                        duration: 1000,
                        template: '<i class="fa fa-camera"></i> Picture attached'
                    });
                    return acFileService.saveImagePersistently(imageUrl);
                })
                .then(function(fileEntry) {
                    $scope.fileSrcs.push(fileEntry.nativeURL);
                })
                .catch(function(error) {
                    console.log(error);
                    return $q.reject(error);
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
                    var cameraOptions = {
                        quality: 75,
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        allowEdit: false,
                        encodingType: Camera.EncodingType.JPEG,
                        saveToPhotoAlbum: true
                    };
                    if (index === 0) {
                        options = cameraOptions;
                    } else if (index === 1) {
                        cameraOptions.saveToPhotoAlbum = false;
                        cameraOptions.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                        options = cameraOptions;
                    }
                    hidePictureSheet();
                    takePicture(options);
                }
            });
        };


        $scope.save = function() {
            if (validateReport()) {
                if ($stateParams.index) {
                    acMin.update(index, $scope.report, $scope.fileSrcs);
                } else {
                    acMin.save($scope.report, $scope.fileSrcs);
                    if ($window.analytics) {
                        $cordovaGoogleAnalytics.trackEvent('MIN', 'Quick Report Submit', 'saved', '1');
                    }
                }
                $state.go('app.min-history');
            }
        };


        $scope.reset = function() {
            if ($stateParams.index) {
                var index = $stateParams.index;
                $scope.report = angular.copy(acMin.draftReports[index].report);
                $scope.report.datetime = moment($scope.report.datetime).toDate();
                $scope.fileSrcs = angular.copy(acMin.draftReports[index].fileSrcs) || [];
                $scope.display.ridingInfo = false;
                $scope.display.avalancheConditions = false;
            } else {
                $scope.resetForm();
                resetDisplay();
            }

        };

        function validateReport() {
            var errors = '';
            if ($scope.report.title.length === 0) {
                $scope.report.title = "auto: Quick Report";
            }
            if ($scope.report.datetime) {
                if (moment($scope.report.datetime).unix() > moment().unix()) {
                    errors += 'Please specify a valid date/time<br/>';
                }
            }
            if (errors.length) {
                $ionicLoading.show({
                    duration: 3000,
                    template: '<div class="form-error"><p><i class="fa fa-warning"></i> There was an error saving you report:</p>' + errors + "</div>"
                });
                return false;
            }
            return true;
        }

        $scope.$on('$destroy', function() {
            if ($scope.locationModal) {
                $scope.locationModal.remove();
            }
        });

    });
