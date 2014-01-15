'use strict';

describe('Service: Googleanalytics', function () {

  // load the service's module
  beforeEach(module('cacmobileApp'));

  // instantiate service
  var Googleanalytics;
  beforeEach(inject(function (_Googleanalytics_) {
    Googleanalytics = _Googleanalytics_;
  }));

  it('should do something', function () {
    expect(!!Googleanalytics).toBe(true);
  });

});
