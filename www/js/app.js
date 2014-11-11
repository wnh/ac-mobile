angular.module('acMobile.services', []);
angular.module('acMobile.directives', ['acComponents']);
angular.module('acMobile.controllers', ['acComponents']);
angular.module('acMobile', ['ionic', 'ngCordova', 'auth0', 'acMobile.services', 'acMobile.controllers', 'acMobile.directives', 'acComponents'])
    .config(function(authProvider) {
        authProvider.init({
            domain: 'avalancheca.auth0.com',
            clientID: 'mcgzglbFk2g1OcjOfUZA1frqjZdcsVgC'
        });
    })

.constant('MAPBOX_ACCESS_TOKEN', 'pk.eyJ1IjoiYXZhbGFuY2hlY2FuYWRhIiwiYSI6Im52VjFlWW8ifQ.-jbec6Q_pA7uRgvVDkXxsA')
    .constant('MAPBOX_MAP_ID', 'tesera.jbnoj7kp')
    .constant('AC_API_ROOT_URL', 'http://avalanche-canada-dev.elasticbeanstalk.com')
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
    });
