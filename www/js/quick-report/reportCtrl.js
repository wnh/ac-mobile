angular.module('acMobile.controllers')
    .filter('trimLocation', function() {
        return function(string, maxlength) {
            return string.substr(0, maxlength);
        };
    })
    .controller('ReportCtrl', function($scope, $stateParams, $state, $rootScope, $window, auth, store, $q, $timeout, acMobileSocialShare, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicActionSheet, $ionicModal, $cordovaGeolocation, $cordovaNetwork, $cordovaSocialSharing, $cordovaCamera, $cordovaGoogleAnalytics, fileArrayCreator, acUser, acMin, acQuickReportData) {

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
            datetime: moment().format('YYYY-MM-DD hh:mm A'),
            latlng: [],
            files: [],
            ridingConditions: angular.copy(acQuickReportData.ridingConditions),
            avalancheConditions: angular.copy(acQuickReportData.avalancheConditions),
            comment: null
        };



        function resetDateTime() {
            $scope.report.datetime = moment().format('YYYY-MM-DDTHH:mm:ss');
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
                    console.log(options);
                    return $cordovaCamera.getPicture(options);
                })
                .then(function(imageUrl) {
                    //$scope.fileSrcs.push(imageUrl);
                    $ionicLoading.show({
                        duration: 1000,
                        template: '<i class="fa fa-camera"></i> Picture attached'
                    });
                    //return fileArrayCreator.processImage(imageUrl);
                    return fileArrayCreator.saveImagePersistently(imageUrl);
                })
                .then(function(fileEntry) {
                    $scope.fileSrcs.push(fileEntry.nativeURL);
                    console.log('pushed:' + fileEntry.nativeURL);
                })

            // .then(function(fileBlob) {
            //     $scope.report.files.push(fileBlob);
            //     $ionicLoading.show({
            //         duration: 1000,
            //         template: '<i class="fa fa-camera"></i> Picture attached'
            //     });
            // })
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
                            saveToPhotoAlbum: true,
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


        $scope.save = function() {
            if (validateReport()) {
                if ($stateParams.index) {
                    acMin.update(index, $scope.report, $scope.fileSrcs);
                } else {
                    acMin.save($scope.report, $scope.fileSrcs);
                    if ($window.analytics) {
                        $cordovaGoogleAnalytics.trackEvent('MIN', 'Quick Report Submit', 'queued', '1');
                    }
                }
                $state.go('app.min-history');
            }
        };


        $scope.reset = function() {
            if ($stateParams.index) {
                var index = $stateParams.index;
                $scope.report = angular.copy(acMin.draftReports[index].report);
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
