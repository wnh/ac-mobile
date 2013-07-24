'use strict';
//Provides services for getting Data from HTTP and local file
//Does not use any instance specific information instead acts as a facade wrapper


// allows  cross origin requests
angular.module('App')
.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


angular.module('App')
.factory('Data', function($http,$rootScope,$q){
	
   var apply = function () {$rootScope.$apply();};
   
   return {
	   
	   //HTTP Get XML and use transform function to convert to json
       httpGetXml: function(url,transform){
     	    var defer = $q.defer();    	   
    	   	
     	    console.log ("requesting data from " + url);
            
    	   	$http.get(
                url,
                {transformResponse:transform}
            ).
            success(function(data, status) {
                console.log("Request succeeded");
                defer.resolve(data);
            }).
            error(function(data, status) {
                console.log("Request failed " + status);
                defer.reject(status);
            });
            
      	  return defer.promise;
       },
   
       //HTTP Get json
       httpGetJson: function(url){
    	   var defer = $q.defer();    	   
	   	
    	   console.log ("requesting data from " + url);
       
	   		$http.get(url).
	   		success(function(data, status) {
	   			console.log("Request succeeded");
	   			defer.resolve(data);
	   			}).
	   		error(function(data, status) {
	   			console.log("Request failed " + status);
	   			defer.reject(status);
	   		});
       
	   		return defer.promise;
       },
       
       // HTTP Put data to URL
       httpPut: function(url, data){
    	    //console.log ("putting data at " + url);
   	   		$http.put(url, data);
   	   	},
   	   	
   	   //Read a local file
   	   fileRead: function(file){
   	
   		   var fileName = 'empty';
   		   
   		   function fail(e) {
   			   console.log("Error", e);
   			   defer.reject(e);
   		   }
 	   
 	       function getFileSystem (fileSystem) {
 	    	   fileName = fileSystem.root.toURL() + file;
 	    	   fileSystem.root.getFile(fileName, {create: true, exclusive: true}, gotFileEntry, fail);
 	       }
 	   
 	       function gotFileEntry(fileEntry) {
 	    	   fileEntry.file(readFile, fail);
 	       }
 	       
 	       function readFile(file) {
 		 	 console.log("reading data from file", fileName);
 	    	 var reader = new FileReader();
 	         reader.onloadend = function(e) { console.log('load end');defer.resolve(reader.result);};
 	         reader.onError = function(e) {console.log('error'); defer.reject(e);};
 	         reader.readAsText(fileName);
 	       }

   		   var defer = $q.defer();    	   
	   	
    	   window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	   window.storageInfo = window.storageInfo || window.webkitStorageInfo; 
    	   
    	   window.storageInfo.requestQuota(PERSISTENT, 
    			   								1024*1024, 
    			   								function(grantedBytes) {window.requestFileSystem(window.PERSISTENT, grantedBytes, getFileSystem, fail);}, 
    			   								fail);
    	   return defer.promise;
   	   },
       
   	   // Write to a local file
       fileWrite: function(file, data){
    	   
    	   var fileName = 'empty';
    	   
    	   function fail(e) {
    	        console.log("Error", e);
    	    }
    	   
    	   function getFileSystem (fileSystem) {
    		    fileName = fileSystem.root.toURL() + file;
    	        fileSystem.root.getFile(fileName, {create: true, exclusive: false}, gotFileEntry, fail);
    	    }
    	   
    	   function gotFileEntry(fileEntry) {
    		    fileEntry.createWriter(gotFileWriter, fail);
    	    }
    	   
    	   function gotFileWriter(fileWriter) {

          	      fileWriter.onwriteend = function(e) {
          	    	console.log("Data written to file", fileName);
      		      };

    		      fileWriter.onerror = function(e) {
    		        console.log('Write failed: ' + e.toString());
    		      };

    		      // Create a new Blob and write it
    		      var blob = new Blob(data, {type: 'text/plain'});

    		      console.log("file Write begun to file", fileName);
    		      fileWriter.write(blob);
    	    }
    	   

    	   window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	   
    	   window.webkitStorageInfo.requestQuota(PERSISTENT, 
    			   								1024*1024, 
    			   								function(grantedBytes) {window.requestFileSystem(window.PERSISTENT, grantedBytes, getFileSystem, fail);}, 
    			   								fail);
       }
       
       
   }
   });


