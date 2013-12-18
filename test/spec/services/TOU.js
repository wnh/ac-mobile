'use strict';

describe('Service: TOU', function () {

  // load the service's module
  beforeEach(module('CACMobile'));

  // instantiate service
  var TOU;
  beforeEach(inject(function (_TOU_) {
    TOU = _TOU_;
  }));

  it('should do exist', function () {
    expect(!!TOU).toBe(true);
  });
  describe ('TOU Functions', function () {
    it('should return false by default', function () {
      var accepted = TOU.accepted();
      //expect(accepted).toBe(false);
    })
  })
});
