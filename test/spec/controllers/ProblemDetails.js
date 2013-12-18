'use strict';

describe('Controller: ProblemDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobile'));

  var ProblemDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProblemDetailsCtrl = $controller('ProblemDetailsCtrl', {
      $scope: scope
    });
  }));

});
