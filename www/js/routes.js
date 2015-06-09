angular.module('acMobile')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: "",
                abstract: true,
                templateUrl: "templates/menu.html"
            })
            .state('app.forecasts-map', {
                cache:false,
                url: "/app/forecasts-map",
                views: {
                    'menuContent': {
                        templateUrl: "templates/forecasts-map.html",
                        controller: "ForecastsMapCtrl"
                    }
                }
            })
            .state('app.forecasts-list', {
                cache:false,
                url: "/app/forecasts-list",
                views: {
                    'menuContent': {
                        templateUrl: "templates/forecasts-list.html",
                        controller: "ForecastsListCtrl"
                    }
                }
            })
            .state('app.forecasts-list-detail', {
                cache:false,
                url: "/app/forecasts-list/:id",
                views: {
                    'menuContent': {
                        templateUrl: "templates/forecasts-list-detail.html",
                        controller: "ForecastsListDetailCtrl"
                    }
                }
            })
            .state('app.min', {
                url: "/app/min/:index",
                views: {
                    'menuContent': {
                        templateUrl: "templates/min.html",
                        controller: "ReportCtrl"
                    }
                }
            })
            .state('app.min-history', {
                url: "/app/min-history",
                views: {
                    'menuContent': {
                        templateUrl: "templates/min-history.html",
                        controller: "MinHistoryCtrl"
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
                        templateUrl: "templates/partner.html",
                        controller: "PartnersCtrl"
                    }
                }
            })
            .state('app.terms', {
                url: "/app/terms",
                views: {
                    'menuContent': {
                        templateUrl: "templates/terms.html",
                        controller: "TermsCtrl"
                    }
                }
            })
            .state('app.offline', {
                url: "/app/offline",
                views: {
                    'menuContent': {
                        templateUrl: "templates/offline.html"
                    }
                }
            });
        $urlRouterProvider.otherwise('/app/forecasts-map');
    });
