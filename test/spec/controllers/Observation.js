'use strict';

describe('Controller: ObservationCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobile'));

  var ObservationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ObservationCtrl = $controller('ObservationCtrl', {
      $scope: scope
    });
  }));

});
