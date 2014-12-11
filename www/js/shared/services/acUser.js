angular.module('acMobile.services')
    .service('acUser', function($rootScope, auth, store, $ionicPopup) {
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
                $rootScope.$broadcast('userLoggedIn');

            }, function(error) {
                console.log("There was an error logging in", error);
            });
        };

        this.logout = function() {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            store.remove('refreshToken');
        };
    });