'use strict';

describe('Service: Data', function () {

  // load the service's module
  beforeEach(module('App'));

  // instantiate service
  var Data;
  var $httpBackend;
  var sampleJson = {name: 'Nexus S'};
  var sampleXml = function() {return x2js.json2xml(sampleJson);};
  
  beforeEach(inject(function (_Data_, _$httpBackend_) {
    
	  Data = _Data_;
    
	  $httpBackend = _$httpBackend_;
      
	  //$httpBackend.expectGET('sample.json').
        //  respond(sampleJson);
      
      //$httpBackend.expectGET('sample.xml').
      	//  respond(sampleXml);
      
  }));

  
  
  it('should do something', function () {
    expect(!!Data).toBe(true);
  });
  
  it('HTTP Get json', function() {
	  
	  $httpBackend.expectGET('sample.json').
        respond(sampleJson);
  
      Data.httpGetJson('sample.json').then(
    	function(data){expect(data).toEqual(sampleJson);},
    	function(error){expect(error).toEqual(sampleJson);});
      
      //$httpBackend.flush();
    });  
  

  it('HTTP Get xml', function() {
	  
	  $httpBackend.expectGET('sample.xml').
    	  respond(sampleXml);
	  
	  var result = 'test';
      
      Data.httpGetXml('sample.xml').then(
    	function(data){expect(data).toEqual(sampleXml);},
    	function(error){expect(error).toEqual(sampleXml);});
      
      //$httpBackend.flush();
    });  
  

});
