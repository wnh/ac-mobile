'use strict';

describe('Service: Data', function () {

  // load the service's module
  beforeEach(module('App'));

  // instantiate service
  var Data;
  var $httpBackend;
  var sampleJson = {name: 'Nexus S'};
  
  beforeEach(inject(function (_Data_, _$httpBackend_) {
    
	  Data = _Data_;
    
	  $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('sample.json').
          respond(sampleJson);
      
  }));

  
  
  it('should do something', function () {
    expect(!!Data).toBe(true);
  });
  
  
  it('HTTP Get json', function() {
	  
	  var result = 'test';
      
      Data.httpGetJson('sample.json').then(
    	function(data){expect(data).toEqual(sampleJson);},
    	function(error){expect(error).toEqual(sampleJson);});
      
      $httpBackend.flush();
    });  
  
  

});
