angular.module('acMobile')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: "",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })
            .state('app.forecasts-map', {
                url: "/app/forecasts-map",
                views: {
                    'menuContent': {
                        templateUrl: "templates/forecasts-map.html",
                        controller: "ForecastsMapCtrl"
                    }
                },
                data: {
                    requiresOnline: true,
                    analyticsName: 'forecasts-map'
                },
                resolve: {
                    regions: function(acForecast) {
                        return acForecast.fetch();
                    },
                    obs: function(acObservation) {
                        return acObservation.byPeriod('7:days');
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
                },
                data: {
                    requiresOnline: true,
                    analyticsName: 'forecasts-list'
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
                        return acForecast.getOne($stateParams.id);
                    }
                },
                data: {
                    requiresOnline: true,
                    analyticsName: function($stateParams) {
                        return 'forecasts-list-detail:' + $stateParams.id;
                    }
                }
            })
            .state('app.report', {
                url: "/app/report",
                views: {
                    'menuContent': {
                        templateUrl: "templates/min.html",
                        controller: "ReportCtrl"
                    }
                },
                data: {
                    requiresOnline: false,
                    analyticsName: 'min-report'
                }
            })
            .state('app.gear', {
                url: "/app/gear",
                views: {
                    'menuContent': {
                        templateUrl: "templates/gear.html",
                        controller: "GearCtrl"
                    }
                },
                data: {
                    requiresOnline: false,
                    analyticsName: 'gear'
                }
            })
            .state('app.partner', {
                url: "/app/partner",
                views: {
                    'menuContent': {
                        templateUrl: "templates/partner.html",
                        controller: "PartnersCtrl"
                    }
                },
                data: {
                    requiresOnline: false,
                    analyticsName: 'partners'
                }
            })
            .state('app.terms', {
                url: "/app/terms",
                views: {
                    'menuContent': {
                        templateUrl: "templates/terms.html",
                        controller: "TermsCtrl"
                    }
                },
                data: {
                    requiresOnline: false,
                    analyticsName: 'terms'
                }
            })
            .state('app.post-share', {
                url: "/app/post-share",
                views: {
                    'menuContent': {
                        templateUrl: "templates/post-share.html",
                        controller: "ShareCtrl"
                    }
                }
            })
            .state('app.offline', {
                url: "/app/offline",
                views: {
                    'menuContent': {
                        templateUrl: "templates/offline.html"
                    }
                },
                data: {
                    requiresOnline: false,
                    analyticsName: 'offline'
                }
            });
        $urlRouterProvider.otherwise('/app/forecasts-map');
    });