'use strict';

describe('Controller: ObobservationviewCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobileApp'));

  var ObobservationviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ObobservationviewCtrl = $controller('ObobservationviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
