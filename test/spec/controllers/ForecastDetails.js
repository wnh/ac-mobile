'use strict';

describe('Controller: ForecastDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobile'));

  var ForecastDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ForecastDetailsCtrl = $controller('ForecastDetailsCtrl', {
      $scope: scope
    });
  }));


});
