'use strict';

describe('Service: platform', function () {

  // load the service's module
  beforeEach(module('CACMobileApp'));

  // instantiate service
  var platform;
  beforeEach(inject(function(_platform_) {
    platform = _platform_;
  }));

  it('should do something', function () {
    expect(!!platform).toBe(true);
  });

});
