'use strict';

describe('Directive: modalPhoto', function () {
  beforeEach(module('CACMobileApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<modal-photo></modal-photo>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the modalPhoto directive');
  }));
});
