'use strict';

describe('Directive: bindHtml', function () {
  beforeEach(module('CACMobileApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<bind-html></bind-html>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the bindHtml directive');
  }));
});
