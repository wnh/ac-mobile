'use strict';

describe('Directive: FileUpload', function () {
  beforeEach(module('CACMobileApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<-file-upload></-file-upload>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the FileUpload directive');
  }));
});
