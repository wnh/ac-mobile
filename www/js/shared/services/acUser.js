angular.module('acMobile.services')
    .service('acUser', function($rootScope, $window, auth, store, $ionicPopup, $cordovaGoogleAnalytics) {
        var self = this;

        this.prompt = function(title) {
            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: 'Would you like to log in now?',
                cancelType: "button-outline button-energized",
                okType: "button-energized"
            });
            confirmPopup.then(function(response) {
                if (response) {
                    self.login();
                }
            });
        };

        this.login = function() {
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

            }, function(error) {
                console.log("There was an error logging in", error);
            });
        };

        this.logout = function() {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            store.remove('refreshToken');
            self.loggedIn = auth.isAuthenticated;
            $rootScope.$broadcast('userLoggedOut');
        };


        //JPB-AUTH : provide an authenticate method - this should not make an API call, just use existing token
        //JPB-AUTH : provide a refresh token method to fetch a token if needed.

        this.loggedIn = auth.isAuthenticated;

        $rootScope.$on('userLoggedIn', function() {
            self.loggedIn = auth.isAuthenticated;
        });

        $rootScope.$on('userLoggedOut', function() {
            self.loggedIn = auth.isAuthenticated;
        });

    });