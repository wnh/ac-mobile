angular.module('acMobile.directives')
    .directive('acOffline', function($cordovaNetwork, $state) {
        return {
            templateUrl: 'js/shared/directives/acOffline.html',
            replace: true,
            transclude: true,
            scope: {
                message: '@',
                isOnline: '='
            },
            link: function(scope, element, attrs) {
                scope.retryOffline = function() {
                    scope.isOnline = $cordovaNetwork.isOnline();
                    console.log('state is: ' + scope.isOnline);
                    if (scope.isOnline) {
                        if ($state.name == 'app.offline') {
                            $state.go('app.forecasts-map');
                        } else {
                            $state.transitionTo($state.current, $state.current.params, {
                                reload: true,
                                inherit: true,
                                notify: true
                            });
                        }
                    }
                }
            }

        };
    });
