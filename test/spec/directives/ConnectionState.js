'use strict';

describe('Directive: ConnectionState', function () {
  beforeEach(module('CACMobileApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<-connection-state></-connection-state>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the ConnectionState directive');
  }));
});
