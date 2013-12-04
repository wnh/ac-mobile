'use strict';

describe('Service: uploadService', function () {

  // load the service's module
  beforeEach(module('CACMobileApp'));

  // instantiate service
  var uploadService;
  beforeEach(inject(function (_uploadService_) {
    uploadService = _uploadService_;
  }));

  it('should do something', function () {
    expect(!!uploadService).toBe(true);
  });

});
