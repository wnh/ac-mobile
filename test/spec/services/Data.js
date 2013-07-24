'use strict';

describe('Service: Data', function () {

  // load the service's module
  beforeEach(module('App'));

  // instantiate service
  var transform = function(result) {
		var json = x2js.xml_str2json(result);
		return json;
	}; 
	
	
  var Data;
  var $httpBackend;
  var sampleJson = {name: 'Nexus S'};
  var sampleXml = x2js.json2xml_str(sampleJson);  
  
  beforeEach(inject(function (_Data_, $injector) {
    
	  Data = _Data_;
    
	  $httpBackend = $injector.get('$httpBackend');
	  
	  $httpBackend.when('GET', 'sample.json').respond(sampleJson);
	  $httpBackend.when('GET', 'sample.xml').respond(sampleXml);
      
  }));
  
  afterEach(function() {
	     $httpBackend.verifyNoOutstandingExpectation();
	     $httpBackend.verifyNoOutstandingRequest();
	   });
  
  
  it('HTTP Get json', function() {
	  var fileName = 'sample.json';
	  $httpBackend.expectGET(fileName);
      
      Data.httpGetJson(fileName).then(
    	function(data){
    		console.log("Success HTTP get JSON");
    		expect(data).toEqual(sampleJson);
    		},
    		
    	function(error){
    	   	console.log("Error HTTP get JSON");
    		expect(error).toEqual(sampleJson);
    		});

	   $httpBackend.flush();
	   
    });  
  

  it('HTTP Get xml', function() {
	  var fileName = 'sample.xml';
	  
	  $httpBackend.expectGET(fileName);
	  
	  Data.httpGetXml(fileName, transform).then(
    	function(data){
    		console.log("success HTTP get XML"); 
    		expect(data).toEqual(sampleJson);
    		},
    		
    	function(error){
    		console.log("Error HTTP get XML");
    		expect(error).toEqual(sampleJson);
    		});

	  $httpBackend.flush();
    });
  

  it('Write/Read file', function(){
	  var data = ['qwertyuiopasdfghjklzxcvbnm'];
	  var filename = 'test.data';
	  console.log("writing data");
	  Data.fileWrite(filename, data);
	  /*console.log("reading data");
	  Data.fileRead(filename).then(
			  function(result){
				  	console.log("file read success");
				  	expect(result).toEqual(data);
				  },
			  function(error){
					console.log("file read success");
					expect(error).toEqual(data);
				  });*/
  });
  

});
