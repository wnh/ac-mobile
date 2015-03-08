angular.module('acMobile.directives')
    .directive('acOffline', function($cordovaNetwork) {
        return {
            templateUrl: 'js/shared/directives/acOffline.html',
            replace: true,
            transclude: true,
            scope: {
                message: '@',
                isOnline: '='
            }
        };
    });