'use strict';

describe('Controller: RegionDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobile'));

  var RegionDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegionDetailsCtrl = $controller('RegionDetailsCtrl', {
      $scope: scope
    });
  }));

});
