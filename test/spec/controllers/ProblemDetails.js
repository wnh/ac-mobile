'use strict';

describe('Controller: ProblemDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobileApp'));

  var ProblemDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProblemDetailsCtrl = $controller('ProblemDetailsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
