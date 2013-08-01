'use strict';

describe('Controller: ForecastDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobileApp'));

  var ForecastDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ForecastDetailsCtrl = $controller('ForecastDetailsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
