'use strict';

describe('Controller: LoadingCtrl', function () {

  // load the controller's module
  beforeEach(module('CACMobile'));

  var LoadingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoadingCtrl = $controller('LoadingCtrl', {
      $scope: scope
    });
  }));

});
