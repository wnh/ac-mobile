'use strict';

describe('Controller: RegionlistCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobile'));

  var RegionlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegionlistCtrl = $controller('RegionlistCtrl', {
      $scope: scope
    });
  }));

});
