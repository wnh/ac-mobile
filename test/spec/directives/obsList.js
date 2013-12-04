'use strict';

describe('Directive: obsList', function () {
  beforeEach(module('CACMobileApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<obs-list></obs-list>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the obsList directive');
  }));
});
