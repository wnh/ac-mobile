angular.module('acMobile.services', ['ngCordova']);
angular.module('acMobile.directives', ['acComponents']);
angular.module('acMobile.controllers', ['acComponents']);
angular.module('acComponents').constant('AC_API_ROOT_URL', 'http://www.avalanche.ca');
angular.module('acMobile', ['ionic', 'ngCordova', 'auth0', 'angular-storage', 'angular-jwt', 'acMobile.services', 'acMobile.controllers', 'acMobile.directives', 'acComponents'])
    .config(function(authProvider, $httpProvider, jwtInterceptorProvider) {

        authProvider.init({
            domain: 'avalancheca.auth0.com',
            clientID: 'mcgzglbFk2g1OcjOfUZA1frqjZdcsVgC'
        });

        jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
            var idToken = store.get('token');
            var refreshToken = store.get('refreshToken');

            // If no token return null
            if (!idToken || !refreshToken) {
                return null;
            }
            //If token is expired, get a new one
            if (jwtHelper.isTokenExpired(idToken)) {
                return auth.getToken({
                    refresh_token: refreshToken,
                    scope: 'openid profile offline_access',
                    device: 'Mobile device',
                    api: 'auth0'
                }).then(function(newToken) {
                    store.set('token', newToken);
                    return newToken;
                });
            } else {
                return idToken;
            }
        };
        $httpProvider.interceptors.push('jwtInterceptor');

    })
    .constant('GA_ID', 'UA-56758486-2')
    .constant('AC_API_ROOT_URL', 'http://www.avalanche.ca')
    .constant('MAPBOX_ACCESS_TOKEN', 'pk.eyJ1IjoiYXZhbGFuY2hlY2FuYWRhIiwiYSI6Im52VjFlWW8ifQ.-jbec6Q_pA7uRgvVDkXxsA')
    .constant('MAPBOX_MAP_ID', 'avalanchecanada.k8o347c9')
    .run(function($ionicPlatform, auth) {
        auth.hookEvents();

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .run(function($rootScope, $timeout, $http, $state, $window, auth, store, jwtHelper, acTerms, acOfflineReports, $cordovaNetwork, $cordovaGoogleAnalytics, $ionicLoading, $ionicPlatform, $ionicPopup, $templateCache, GA_ID) {

        $ionicPlatform.ready().then(function() {
            $ionicPlatform.registerBackButtonAction(function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Exit Avalanche Canada?',
                    template: '',
                    cancelType: "button-outline button-energized",
                    okType: "button-energized"
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        navigator.app.exitApp();
                    } else {

                    }
                });
            }, 100);

            var deRegisterAuthClose;
            auth.config.auth0lib.on('shown', function() {
                deRegisterAuthClose = $ionicPlatform.registerBackButtonAction(function() {
                    auth.config.auth0lib.hide();
                }, 101);
            });
            auth.config.auth0lib.on('hidden', function() {
                deRegisterAuthClose();
            });

            acOfflineReports.synchronize();
            if ($window.analytics) {
                $cordovaGoogleAnalytics.startTrackerWithId(GA_ID).then(function() {
                    console.log("initialized analytics");
                });
            }

        });

        $rootScope.$on('$locationChangeStart', function() {
            $ionicPlatform.ready().then(function() {
                if ($cordovaNetwork.isOnline() && !auth.isAuthenticated) {
                    var token = store.get('token');
                    var refreshToken = store.get('refreshToken');
                    if (token) {
                        if (!jwtHelper.isTokenExpired(token)) {
                            auth.authenticate(store.get('profile'), token).then(function() {
                                $rootScope.$broadcast('userLoggedIn');
                            });

                        } else {
                            if (refreshToken) {
                                return auth.getToken({
                                        refresh_token: refreshToken,
                                        scope: 'openid profile offline_access',
                                        device: 'Mobile device',
                                        api: 'auth0'
                                    })
                                    .then(function(idToken) {
                                        store.set('token', idToken);
                                        auth.authenticate(store.get('profile'), idToken)
                                            .then(function() {
                                                $rootScope.$broadcast('userLoggedIn');
                                            }, function(error) {
                                                console.log(error);
                                            });
                                    });
                            }
                        }
                    }
                }
            });
        });

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (toState.name != 'app.terms' && !acTerms.termsAccepted()) {
                console.log("Terms not accepted - re-routing to terms");
                event.preventDefault();
                $state.go('app.terms');
            }
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            event.preventDefault();
            $state.go('app.offline');
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            var track = toState.name;
            if (toParams.id) {
                track += ":" + toParams.id;
            }
            if ($window.analytics) {
                $cordovaGoogleAnalytics.trackView(track);
            }
        });


        $timeout(function() {
            $http.get('templates/min-report-form.html')
                .success(function(result) {
                    $templateCache.put("min-report-form.html", result);
                })
                .error(function(error) {
                    //console.log(error);
                });
        }, 250);

    });