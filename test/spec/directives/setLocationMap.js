'use strict';

describe('Directive: setLocationMap', function () {
  beforeEach(module('CACMobileApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<set-location-map></set-location-map>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the setLocationMap directive');
  }));
});
