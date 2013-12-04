'use strict';

describe('Service: DeviceReady', function () {

  // load the service's module
  beforeEach(module('CACMobileApp'));

  // instantiate service
  var DeviceReady;
  beforeEach(inject(function (_DeviceReady_) {
    DeviceReady = _DeviceReady_;
  }));

  it('should do something', function () {
    expect(!!DeviceReady).toBe(true);
  });

});
