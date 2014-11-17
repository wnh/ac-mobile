angular.module('acMobile')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: "",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })
            //TODO: remove this login route if we don't need it.
            .state('app.login', {
                url: "/app/login",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login.html",
                        controller: "LoginCtrl"
                    }
                }

            })
            .state('app.forecasts-map', {
                url: "/app/forecasts-map",
                views: {
                    'menuContent': {
                        templateUrl: "templates/forecasts-map.html",
                        controller: "ForecastsMapCtrl"
                    }
                },
                resolve: {
                    resForecasts: function(acForecast) {
                        return acForecast.fetch();
                    }
                }
            })
            .state('app.forecasts-list', {
                url: "/app/forecasts-list",
                views: {
                    'menuContent': {
                        templateUrl: "templates/forecasts-list.html",
                        controller: "ForecastsListCtrl"
                    }
                }
            })
            .state('app.forecasts-list-detail', {
                url: "/app/forecasts-list/:id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/forecasts-list-detail.html",
                        controller: "ForecastsListDetailCtrl"
                    }
                },
                resolve: {
                    forecast: function($stateParams, acForecast) {
                        // return true;
                        return acForecast.getOne($stateParams.id);
                        // }

                    }
                }
            })
            .state('app.report', {
                url: "/app/report",
                views: {
                    'menuContent': {
                        templateUrl: "templates/report.html",
                        controller: "ReportCtrl"
                    }
                }
            })
            .state('app.share-incident-report', {
                url: "/app/share-incident-report",
                views: {
                    'menuContent': {
                        templateUrl: "templates/share-incident-report.html"
                    }
                }
            })
            .state('app.share-field-obs', {
                url: "/app/share-field-obs",
                views: {
                    'menuContent': {
                        templateUrl: "templates/share-field-obs.html"
                    }
                }
            })
            .state('app.gear', {
                url: "/app/gear",
                views: {
                    'menuContent': {
                        templateUrl: "templates/gear.html",
                        controller: "GearCtrl"
                    }
                }
            })
            .state('app.partner', {
                url: "/app/partner",
                views: {
                    'menuContent': {
                        templateUrl: "templates/partner.html"
                    }
                }
            })
            .state('app.terms', {
                url: "/app/terms",
                views: {
                    'menuContent': {
                        templateUrl: "templates/terms.html"
                    }
                }
            })
            .state('app.post-share', {
                url: "/app/post-share",
                views: {
                    'menuContent': {
                        templateUrl: "templates/post-share.html"
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/forecasts-map');
    });
