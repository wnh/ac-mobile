angular.module('acMobile.controllers')
    .controller('LoginCtrl', function($scope, $state, auth, store) {
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
            console.log("Successfully logged in");
            $state.go("app.forecasts-map");
        }, function(error) {
            // Oops something went wrong during login:
            console.log("There was an error logging in", error);
            $state.go("app.forecasts-map");
        });

    });
