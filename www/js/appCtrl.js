angular.module('acMobile.controllers')
    .controller('AppCtrl', function($scope, auth) {
        $scope.login = function() {
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
                // $state.go('tab.dash');
                console.log("Successfully logged in");
            }, function(error) {
                // Oops something went wrong during login:
                console.log("There was an error logging in", error);
            });
        };
        // $scope.login = function() {
        //     auth.signin({
        //         // authParams: {
        //         //     scope: 'openid profile' // This is if you want the full JWT
        //         // }
        //     }, function() {
        //         // $location.path('/user-info')
        //         console.log('signed in');
        //     }, function(err) {
        //         console.log("Error :(", err);
        //     });
        // }; //Any modals launched from the side menu will be triggered here.

    });
