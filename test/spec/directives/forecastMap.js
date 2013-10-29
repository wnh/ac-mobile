'use strict';

describe('Directive: forecastMap', function () {
  beforeEach(module('CACMobileApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<forecast-map></forecast-map>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the forecastMap directive');
  }));
});
