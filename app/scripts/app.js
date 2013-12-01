'use strict';

angular.module('CACMobile',
  [
    'ngResource',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
       .when('/', {
        templateUrl: 'views/Map.html',
        controller: 'MapCtrl'
        })
       .when('/gear', {
        templateUrl: 'views/gear.html',
        controller: 'NavCtrl'
      })
      .when('/region-list', {
        templateUrl: 'views/regionList.html',
        controller: 'RegionlistCtrl'
      })
      .when('/region-details/:region', {
        templateUrl: 'views/regionDetails.html',
        controller: 'RegionDetailsCtrl'
      })
      .when('/danger-scale', {
        templateUrl: 'views/dangerScale.html'
      })
      .when('/details-info/:region', {
        templateUrl: 'views/detailsInfo.html',
        controller: 'ForecastDetailsCtrl'
      })
      .when('/problems/:region', {
        templateUrl: 'views/problems.html',
        controller: 'ProblemDetailsCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'NavCtrl'
      })
      .when('/tou', {
        templateUrl: 'views/tou.html',
          controller: 'NavCtrl'
      })
      .when('/Map', {
        templateUrl: 'views/Map.html',
        controller: 'MapCtrl'
      })
      .when('/Loading', {
        templateUrl: 'views/Loading.html',
        controller: 'LoadingCtrl'
      })
      .when('/Observation', {
        templateUrl: 'views/Observation.html',
        controller: 'ObservationCtrl'
      })
      .when ('/obs-list', {
        templateUrl: 'views/obsList.html',
        controller: 'ObservationListCtrl'
      })
      .otherwise({
        templateUrl: 'views/Loading.html',
        controller: 'LoadingCtrl'
      });
  })
.run( function($rootScope, $location, TOU) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ( TOU.accepted() == false ) {
          $location.path( "/tou" );
        }
    });
 });
