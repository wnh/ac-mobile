angular.module('acMobile.controllers')
    .controller('AppCtrl', function($scope, $rootScope, $timeout, auth, store, $state, $ionicPlatform) {
        $scope.user = {};
        $scope.user.loggedIn = auth.isAuthenticated;

        $rootScope.$on('userLoggedIn', function() {
            $scope.user.loggedIn = auth.isAuthenticated;
        });
        $rootScope.$on('userLoggedOut', function() {
            $scope.user.loggedIn = auth.isAuthenticated;
        });

        $scope.logout = function() {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            store.remove('refreshToken');
            $rootScope.$broadcast('userLoggedOut');
        };


        $scope.login = function() {
            auth.signin({
                authParams: {
                    scope: 'openid profile offline_access',
                    device: 'Mobile device'
                }
            }, function(profile, token, accessToken, state, refreshToken) {
                // Login was successful
                store.set('profile', profile);
                store.set('token', token);
                store.set('refreshToken', refreshToken);

                $rootScope.$broadcast('userLoggedIn');
            }, function(error) {
                // Oops something went wrong during login:
                console.log("There was an error logging in", error);
            });
        };

    });
