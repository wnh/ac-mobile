'use strict';

describe('Controller: ObservationviewmapCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobileApp'));

  var ObservationviewmapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ObservationviewmapCtrl = $controller('ObservationviewmapCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
