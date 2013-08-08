'use strict';

angular.module('CACMobile', [])
  .config(function ($routeProvider) {
    $routeProvider
       .when('/', {
        templateUrl: 'views/Map.html',
        controller: 'MapCtrl'
        })
       .when('/gear', {
        templateUrl: 'views/gear.html'
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
        templateUrl: 'views/about.html'
      })
      .when('/tou', {
        templateUrl: 'views/tou.html'
      })
      .when('/Map', {
        templateUrl: 'views/Map.html',
        controller: 'MapCtrl'
      })
      .when('/Loading', {
        templateUrl: 'views/Loading.html',
        controller: 'LoadingCtrl'
      })
      .otherwise({
        templateUrl: 'views/Loading.html',
        controller: 'LoadingCtrl'
      });
  });
