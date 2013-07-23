'use strict';

describe('Service: location', function () {

  // load the service's module
  beforeEach(module('blahApp'));

  // instantiate service
  var location;
  beforeEach(inject(function (_location_) {
    location = _location_;
  }));

  it('should do something', function () {
    expect(!!location).toBe(true);
  });

});
