angular.module('acMobile.controllers')
    .filter('trimLocation', function() {
        return function(string, maxlength) {
            return string.substr(0, maxlength);
        };
    })
    .controller('ReportCtrl', function($scope, $rootScope, auth, store, $q, $http, $timeout, $state, acMobileSocialShare, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicActionSheet, $ionicModal, $cordovaGeolocation, $cordovaNetwork, $cordovaSocialSharing, $cordovaCamera, $cordovaFile, fileArrayCreator, AC_API_ROOT_URL, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID) {

        var Camera = navigator.camera;

        $scope.display = {
            "ridingInfo": false,
            "avalancheConditions": false
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
                        getLocation()
                            .then(function() {
                                hideSheet();
                            });
                    } else if (index === 1) {
                        hideSheet();
                        //if ($cordovaNetwork.isOnline()) {
                        locationModal.show();
                        // } else {
                        //     $ionicLoading.show({
                        //         duration: 3000,
                        //         template: '<i class="fa fa-chain-broken"></i> <p>You must be connected to the network to pick from a map.</p>'
                        //     });

                        //                        }
                    }
                }
            });
        };


        function getLocation() {
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };
            return $ionicPlatform.ready()
                .then(function() {
                    $ionicLoading.show({
                        template: '<i class="fa fa-circle-o-notch fa-spin"></i> Acquiring Position',
                        delay: 100
                    });
                    return $cordovaGeolocation.getCurrentPosition(options);
                })
                .then(function(position) {
                    $ionicLoading.hide();
                    $scope.report.latlng = [position.coords.latitude, position.coords.longitude];
                })
                .catch(function(error) {
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: 'There was a problem getting your position',
                        duration: 3000
                    });
                    console.error("GeoLocation Error" + error);
                    return $q.reject(error);
                });
        }

        $scope.markerPosition = {
            latlng: [0, 0]
        };
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
                .then(fileArrayCreator.processImage)
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
                            targetWidth: 640,
                            targetHeight: 480,
                            saveToPhotoAlbum: true
                        };
                        takePicture(options);

                    } else if (index === 1) {
                        hidePictureSheet();
                        options = {
                            quality: 75,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit: true,
                            encodingType: Camera.EncodingType.JPEG,
                            targetWidth: 640,
                            targetHeight: 480,
                            saveToPhotoAlbum: true
                        };
                        takePicture(options);
                    }
                }
            });
        };

        function login() {
            //TODO-JPB : this is repetive, we should extract to a service.
            auth.signin({
                authParams: {
                    scope: 'openid profile offline_access',
                    device: 'Mobile device'
                }
            }, function(profile, token, accessToken, state, refreshToken) {
                store.set('profile', profile);
                store.set('token', token);
                store.set('refreshToken', refreshToken);
                $rootScope.$broadcast('userLoggedIn');

            }, function(error) {
                console.log("There was an error logging in", error);
            });
        }

        function sharePopup(link) {
            $scope.sharePopup = $ionicPopup.show({
                templateUrl: 'templates/post-share.html ',
                title: "Observation report saved",
                subTitle: "Share your report",
                scope: $scope
            });
            $scope.sharePopup.then(function(provider) {
                if (provider) {
                    acMobileSocialShare.share(link, provider);
                }
                //TODO-JPB: $scope.resetForm();
            });
        }

        $scope.submit = function() {
            if (auth.isAuthenticated) {
                $ionicLoading.show({
                    template: '<i class="fa fa-circle-o-notch fa-spin"></i> Sending report'
                });
                $scope.submitForm().then(function(result) {
                    $ionicLoading.hide();
                    var link = AC_API_ROOT_URL + '/api/min/submissions/' + $result.data.subid;
                    sharePopup(link);
                }).catch(function(error) {
                    $ionicLoading.hide();
                });
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'You must be logged in to submit a report',
                    template: 'Would you like to log in now?',
                    cancelType: "button-outline button-energized",
                    okType: "button-energized"
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        login();
                    } else {
                        console.log('User does not want to log in');
                    }
                });
            }
        };


        $scope.$on('$destroy', function() {
            $scope.locationModal.remove();
        });

    });