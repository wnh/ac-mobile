'use strict';

describe('Service: TOU', function () {

  // load the service's module
  beforeEach(module('CACMobileApp'));

  // instantiate service
  var TOU;
  beforeEach(inject(function (_TOU_) {
    TOU = _TOU_;
  }));

  it('should do something', function () {
    expect(!!TOU).toBe(true);
  });

});
