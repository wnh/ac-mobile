'use strict';

describe('Controller: ObservatitionlistCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobileApp'));

  var ObservatitionlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ObservatitionlistCtrl = $controller('ObservatitionlistCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
