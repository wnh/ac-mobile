'use strict';

describe('Service: RegionDefinition', function () {

  // load the service's module
  beforeEach(module('CACMobileApp'));

  // instantiate service
  var RegionDefinition;
  beforeEach(inject(function (_RegionDefinition_) {
    RegionDefinition = _RegionDefinition_;
  }));

  it('should do something', function () {
    expect(!!RegionDefinition).toBe(true);
  });

});
