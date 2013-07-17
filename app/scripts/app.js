'use strict';

angular.module('App', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
       .when('/gear', {
        templateUrl: 'views/gear.html'
      })
      .when('/regionList', {
        templateUrl: 'views/regionList.html'
      })
      .when('/regionDetails', {
        templateUrl: 'views/regionDetails.html'
      })
      .when('/danger-scale', {
        templateUrl: 'views/dangerScale.html'
      })
      .when('/details-info', {
        templateUrl: 'views/detailsInfo.html'
      })
      .when('/problems', {
        templateUrl: 'views/problems.html'
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/tou', {
        templateUrl: 'views/tou.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
