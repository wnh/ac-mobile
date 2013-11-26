'use strict';

describe('Controller: RegionDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('App'));

  var RegionDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegionDetailsCtrl = $controller('RegionDetailsCtrl', {
      $scope: scope
    });
  }));

  //it('should attach a list of awesomeThings to the scope', function () {
  //  expect(scope.awesomeThings.length).toBe(3);
  //});
});
