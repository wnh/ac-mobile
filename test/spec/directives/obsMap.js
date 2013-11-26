'use strict';

describe('Directive: obsMap', function () {
  beforeEach(module('CACMobileApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<obs-map></obs-map>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the obsMap directive');
  }));
});
