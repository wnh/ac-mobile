angular.module('acMobile.services')
    .service('acUser', function($rootScope, $q, $window, auth, jwtHelper, store, $ionicPopup, $cordovaGoogleAnalytics) {
        var self = this;

        this.prompt = function(title) {
            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: 'Would you like to log in now?',
                cancelType: "button-outline button-energized",
                okType: "button-energized"
            });
            return confirmPopup.then(function(response) {
                if (response) {
                    return self.login();
                } else {
                    return $q.reject('cancelled');
                }
            });
        };

        this.login = function() {
            var deferred = $q.defer();
            auth.signin({
                authParams: {
                    scope: 'openid profile offline_access',
                    device: 'Mobile device'
                }
            }, function(profile, token, accessToken, state, refreshToken) {
                store.set('profile', profile);
                store.set('token', token);
                store.set('refreshToken', refreshToken);
                self.loggedIn = auth.isAuthenticated;
                $rootScope.$broadcast('userLoggedIn');
                if ($window.analytics) {
                    $cordovaGoogleAnalytics.setUserId(profile.email);
                }
                deferred.resolve('authenticated');

            }, function(error) {
                console.log("There was an error logging in", error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        this.logout = function() {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            store.remove('refreshToken');
            self.loggedIn = auth.isAuthenticated;
            $rootScope.$broadcast('userLoggedOut');
        };

        this.authenticate = function() {
            if (!auth.authenticated) {
                var token = store.get('token');
                var refreshToken = store.get('refreshToken');
                if (token) {
                    if (!jwtHelper.isTokenExpired(token)) {
                        return auth.authenticate(store.get('profile'), token)
                            .then(function() {
                                console.log('user authenticated!');
                                $rootScope.$broadcast('userLoggedIn');
                                return 'authenticated';
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
                                    return auth.authenticate(store.get('profile'), idToken);
                                })
                                .then(function() {
                                    $rootScope.$broadcast('userLoggedIn');
                                    return 'authenticated';
                                })
                                .catch(function(error) {
                                    console.log(error);
                                    return $q.reject(error);
                                });

                        } else {
                            return self.prompt("You must be logged in to submit a report to the MIN");
                        }
                    }
                } else {
                    return self.prompt("You must be logged in to submit a report to the MIN");
                }
            } else {
                console.log('already auth');
                return $q.when('authenticated');
            }
        };

        this.loggedIn = auth.isAuthenticated;

        $rootScope.$on('userLoggedIn', function() {
            self.loggedIn = auth.isAuthenticated;
        });

        $rootScope.$on('userLoggedOut', function() {
            self.loggedIn = auth.isAuthenticated;
        });

    });
