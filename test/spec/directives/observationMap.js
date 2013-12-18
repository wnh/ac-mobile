'use strict';

describe('Directive: observationMap', function () {
  beforeEach(module('CACMobileApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<observation-map></observation-map>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the observationMap directive');
  }));
});
