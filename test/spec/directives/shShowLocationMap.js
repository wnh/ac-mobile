'use strict';

describe('Directive: shShowLocationMap', function () {
  beforeEach(module('CACMobileApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<sh-show-location-map></sh-show-location-map>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the shShowLocationMap directive');
  }));
});
