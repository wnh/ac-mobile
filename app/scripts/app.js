'use strict';

angular.module('CACMobile',
  [
    'ngResource',
    'ui.bootstrap',
    'ngRoute',
    'ngSanitize',
    'truncate'
  ])
  .config(function ($routeProvider, $httpProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider
      .when('/', {
        templateUrl: 'views/Loading.html',
        controller: 'LoadingCtrl'
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
      .when('/RegionForecast/:region', {
        templateUrl: 'views/RegionForecast.html',
        controller: 'RegionForecastCtrl'
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
      .when('/ObservationViewDetail/:id', {
        templateUrl: 'views/ObservationViewDetail.html',
        controller: 'ObservationViewDetailCtrl'
      })
      .when ('/obsList', {
        templateUrl: 'views/obsList.html',
        controller: 'ObservationListCtrl'
      })
      .when('/ObservationSubmit', {
        templateUrl: 'views/ObservationSubmit.html',
        controller: 'ObservationsubmitCtrl'
      })
      .when('/ObservationViewMap', {
        templateUrl: 'views/ObservationViewMap.html',
        controller: 'ObservationViewMapCtrl'
      })
      .otherwise({
        templateUrl: 'views/Loading.html',
        controller: 'LoadingCtrl'
      });
  })
.run( function($rootScope, $location, TOU, GoogleAnalytics) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {

      if( $location.path() != "tou" && $location.path() != "/")
      {
        if ( TOU.accepted() == false ) {
            $location.path( "/tou" );
          }
      }

    });

    $rootScope.$on('$routeChangeSuccess', function () {
        GoogleAnalytics.trackPage($location.path());
    })


 })


