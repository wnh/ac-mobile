'use strict';

angular.module('acComponents')
    .constant('AC_API_ROOT_URL', 'http://avalanche-canada-dev.elasticbeanstalk.com')

angular.module('acComponentsExampleApp', ['acComponents', 'ngRoute', 'auth0', 'angular-storage', 'angular-jwt'])

.constant('MAPBOX_ACCESS_TOKEN', 'pk.eyJ1IjoiYXZhbGFuY2hlY2FuYWRhIiwiYSI6Im52VjFlWW8ifQ.-jbec6Q_pA7uRgvVDkXxsA')
    .constant('MAPBOX_MAP_ID', 'tesera.jbnoj7kp')
    .constant('AC_API_ROOT_URL', 'http://avalanche-canada-dev.elasticbeanstalk.com')
    .config(function($routeProvider, $locationProvider) {

        // enables html5 push state
        $locationProvider.html5Mode(true);
        // little hack for auth0 to be able to interpret social callbacks properlly
        $locationProvider.hashPrefix('!');

        $routeProvider.when('/', {
            resolve: {
                regions: function (acForecast) {
                    return acForecast.fetch();
                },
                obs: function (acObservation) {
                    return acObservation.byPeriod('7-days');
                },
                ob: function () {
                    return [];
                }
            },
            templateUrl: '/partials/map.html',
            controller: 'exampleController',
        })
        .when('/share/:title/:obid', {
            resolve: {
                regions: function (acForecast) {
                    return acForecast.fetch();
                },
                obs: function () {
                    return [];
                },
                ob: function ($route, acObservation) {
                    return acObservation.getOne($route.current.params.obid);
                }
            },
            templateUrl: '/partials/map.html',
            controller: 'exampleController',
        });

    })
    .controller('exampleController', function ($scope, $timeout, regions, obs, ob, acForecast, acObservation, auth, $templateCache) {
        angular.extend($scope, {
            auth: auth,
            current: {
                region: null
            },
            drawer: {
                visible: false,
                enabled: true
            },
            imageLoaded: false,
            regions: regions,
            obs: obs,
            ob: ob,
            filters: {
                obsPeriod: '7-days'
            },
            regionsVisible: true
        });

        $scope.$watch('current.region', function (newRegion, oldRegion) {
            if(newRegion && newRegion !== oldRegion) {
                $scope.drawer.visible = false;
                $scope.imageLoaded = false;

                if(!newRegion.feature.properties.forecast) {
                    acForecast.getOne(newRegion.feature.id).then(function (forecast) {
                        newRegion.feature.properties.forecast = forecast;
                    });
                }

                $timeout(function () {
                    $scope.drawer.visible = true;
                }, 800);
            }
        });

        $scope.addSubmission = function() {
            $('#minForm')
                .modal('show')
                .on('hidden.bs.modal', function (e) {
                    $scope.resetForm();
                });
        };

        $scope.$on('ac.min.obclicked', function (e, obHtml) {
            var $modal = $('#mobileMapPopup');

            if(!$modal.length){
                var modalTemplate = $templateCache.get('min-report-popup-modal.html');
                var $modal = $(modalTemplate);
                $(document.body).append($modal);
            }

            $modal.find('.modal-body').html(obHtml);
            $modal.modal('show');
        });

        $scope.dateFilters = ['7-days', '14-days', '30-days'];
        $scope.toggleFilter = function (filter) {
            if(filter){
                var filterType = filter.split(':')[0];
                var filterValue = filter.split(':')[1];

                if(filterType === 'obsPeriod' && $scope.filters[filterType] !== filterValue) {
                    $scope.filters[filterType] = filterValue;
                    var period = filterValue.replace('-', ':');

                    acObservation.byPeriod(period).then(function (obs) {
                        $scope.obs = obs;
                    });

                    $timeout(function () {
                        var i = $scope.dateFilters.indexOf(filterValue);
                        $scope.dateFilters.splice(i, 1);
                        $scope.dateFilters.unshift(filterValue);
                        $scope.expanded = false;
                    }, 0);
                }

            } else {
                if($scope.filters.obsPeriod === '') {
                    $scope.toggleFilter('obsPeriod:' + $scope.dateFilters[0]);
                } else {
                    $scope.obs = [];
                    $scope.filters.obsPeriod = '';
                }
            }
        };

    });