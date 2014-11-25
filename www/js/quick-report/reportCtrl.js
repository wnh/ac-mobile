angular.module('acMobile.controllers')
    .filter('trimLocation', function() {
        return function(string, maxlength) {
            return string.substr(0, maxlength);
        };
    })
    .controller('ReportCtrl', function($scope, $rootScope, auth, store, $q, $http, $timeout, $state, $ionicPlatform, $ionicPopup, $ionicLoading, $ionicActionSheet, $ionicModal, $cordovaGeolocation, $cordovaNetwork, $cordovaCamera, $cordovaFile, acReport, fileArrayCreator, ridingConditionsData, MAPBOX_ACCESS_TOKEN, MAPBOX_MAP_ID) {
        //Cordova setup
        var Camera = navigator.camera;

        //display form sections
        $scope.display = {
            "ridingInfo": false,
            "avalancheConditions": false
        };

        $scope.tempLocation = {
            lat: "",
            lng: ""
        };
        var map;
        var marker;
        var popup;


        $scope.ridingConditions = ridingConditionsData;
        $scope.report = {
            title: "",
            datetime: moment().format('YYYY-MM-DDTHH:mm:ss'),
            location: [],
            images: [],
            files: [],
            ridingConditions: angular.copy(ridingConditionsData),
            avalancheCondtions: {
                'slab': false,
                'sound': false,
                'snow': false,
                'temp': false
            },
            comments: ""
        };
        $scope.resetReport = function() {
            $scope.report = {
                title: "",
                datetime: moment().format('YYYY-MM-DDTHH:mm:ss'),
                location: [],
                images: [],
                files: [],
                ridingConditions: ridingConditionsData,
                avalancheCondtions: {
                    'slab': false,
                    'sound': false,
                    'snow': false,
                    'temp': false
                },
                comments: ""
            };
        };
        $scope.submitReport = function() {
            // todo enable online check
            // if ($cordovaNetwork.isOnline()){

            //if online, we must be signed in to submit the report, so let's check that:
            if (auth.isAuthenticated) {
                $ionicLoading.show({
                    template: '<i class="fa fa-circle-o-notch fa-spin"></i> Sending report'
                });
                //validate we are logged in
                //todo validation step
                acReport.prepareData($scope.report)
                    .then(acReport.sendReport)
                    .then(function(result) {
                        console.log(result);
                        $ionicLoading.hide();
                    })
                    .catch(function(error) {
                        console.log(error);
                        $ionicLoading.hide();
                    });

            } else {
                //not authenticated - so let's prompt them to go sign in with a popup.
                var confirmPopup = $ionicPopup.confirm({
                    title: 'You must be logged in to submit a report',
                    subTitle: "asdas ",
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

            //}
            // else {
            //      $ionicLoading.show({duration:3000, template: '<i class="fa fa-chain-broken"></i> <p>You must be connected to the network to submit reports. Please try later.</p>'});
            // }
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
                        if ($cordovaNetwork.isOnline()) {
                            $scope.showLocationModal();
                        } else {
                            $ionicLoading.show({
                                duration: 3000,
                                template: '<i class="fa fa-chain-broken"></i> <p>You must be connected to the network to pick from a map.</p>'
                            });

                        }
                    }
                }
            });
        };

        function login() {
            //TODO-JPB : this is repetive, we should extract to a service.
            auth.signin({
                authParams: {
                    scope: 'openid offline_access',
                    device: 'Mobile device'
                }
            }, function(profile, token, accessToken, state, refreshToken) {
                // Login was successful
                store.set('profile', profile);
                store.set('token', token);
                store.set('refreshToken', refreshToken);
                $rootScope.$broadcast('userLoggedIn');
                console.log("Successfully logged in");
            }, function(error) {
                // Oops something went wrong during login:
                console.log("There was an error logging in", error);
            });
        }

        function getLocation() {
            return $ionicPlatform.ready()
                .then(function() {
                    $ionicLoading.show({
                        template: '<i class="fa fa-circle-o-notch fa-spin"></i> Acquiring Position',
                        delay: 100
                    });
                    return $cordovaGeolocation.getCurrentPosition();
                })
                .then(function(position) {
                    $ionicLoading.hide();
                    $scope.report.location = [position.coords.latitude, position.coords.longitude];
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

        $ionicModal.fromTemplateUrl('templates/location-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.locationModal = modal;
        });

        $scope.showLocationModal = function() {
            $scope.locationModal.show()
                .then(function() {
                    if (!map) {
                        L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
                        map = L.mapbox.map('map', MAPBOX_MAP_ID, {
                            attributionControl: false
                        });
                        map.on('click', onMapClick);
                    }
                });
        };

        function onMapClick(e) {
            if (!marker) {
                $scope.$apply(function() {
                    $scope.tempLocation.lat = e.latlng.lat;
                    $scope.tempLocation.lng = e.latlng.lng;
                });
                var latlng = new L.LatLng(e.latlng.lat, e.latlng.lng);

                marker = L.marker(latlng, {
                    icon: L.mapbox.marker.icon({
                        'marker-color': 'f79118'
                    }),
                    draggable: true
                });

                marker
                    .bindPopup("Position: " + e.latlng.toString().substr(6) + "<br/>(drag to relocate)")
                    .addTo(map)
                    .openPopup();

                marker.on('dragend', function(e) {
                    var position = marker.getLatLng();
                    $scope.$apply(function() {
                        $scope.tempLocation.lat = position.lat;
                        $scope.tempLocation.lng = position.lng;
                    });
                    marker.setPopupContent("Position: " + position.toString().substr(6));
                    marker.openPopup();
                });
            }
        }
        $scope.cancelLocationModal = function() {
            $scope.locationModal.hide();
        };

        $scope.confirmLocation = function() {
            if ($scope.tempLocation.lat) {
                $scope.report.location = [$scope.tempLocation.lat, $scope.tempLocation.lng];
                $scope.locationModal.hide();
            } else {
                $ionicLoading.show({
                    duration: 2000,
                    template: '<i class="fa fa-exclamation-triangle"></i> You have not selected a position yet'
                });
            }
            //emit  event to mark a position
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

        //clean up
        $scope.$on('$destroy', function() {
            $scope.locationModal.remove();
        });

    });
