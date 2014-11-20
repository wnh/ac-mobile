angular.module('acMobile.controllers')
    .controller('LoginCtrl', function($scope, $state, auth, store) {
        auth.signin({
            // This is a must for mobile projects
            popup: true,
            // Make the widget non closeable
            standalone: true,
            // This asks for the refresh token
            // So that the user never has to log in again
            offline_mode: true,
            device: 'Mobile device'
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
        });

    });
