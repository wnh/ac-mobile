'use strict';

describe('Controller: ObservatitionlistCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobile'));

  var ObservatitionlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ObservatitionlistCtrl = $controller('ObservatitionlistCtrl', {
      $scope: scope
    });
  }));

});
