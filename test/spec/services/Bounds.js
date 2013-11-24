'use strict';

describe('Service: Bounds', function () {

  // load the service's module
  beforeEach(module('CACMobileApp'));

  // instantiate service
  var Bounds;
  beforeEach(inject(function (_Bounds_) {
    Bounds = _Bounds_;
  }));

  it('should do something', function () {
    expect(!!Bounds).toBe(true);
  });

});
