'use strict';

describe('Service: CallVenderApp', function () {

  // load the service's module
  beforeEach(module('CACMobileApp'));

  // instantiate service
  var CallVenderApp;
  beforeEach(inject(function (_CallVenderApp_) {
    CallVenderApp = _CallVenderApp_;
  }));

  it('should do something', function () {
    expect(!!CallVenderApp).toBe(true);
  });

});
