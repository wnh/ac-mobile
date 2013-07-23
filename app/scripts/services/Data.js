'use strict';
angular.module('App')
.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

//HTTP Get and use tranform function to convert to json
angular.module('App')
.factory('Data', function($http,$rootScope,$q){
	
   var apply = function () {$rootScope.$apply();};
   
   return {
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
       
       httpPut: function(url, data){
    	    console.log ("putting data at " + url);
   	   		$http.put(url, data);
   	   	},
   	   	
   	   fileRead: function(file){
   	
   		   function fail(e) {
   			   console.log("Error", e);
   		   }
 	   
 	       function getFileSystem (fileSystem) {
 	    	   fileSystem.root.getFile(file, {create: true, exclusive: false}, gotFileEntry, fail);
 	       }
 	   
 	       function gotFileEntry(fileEntry) {
 	    	   fileEntry.file(readFile, fail);
 	       }
 	       
 	       function readFile(file) {
 	         var reader = new FileReader();
 	         reader.onloadend = function(e) { defer.resolve(reader.result);};
 	         reader.onError = function(e) {defer.reject(e);};
 	         reader.readAsText(file);
 	       }

   		   var defer = $q.defer();    	   
	   	
	 	   console.log("reading data from file", file);
    	   window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	   window.storageInfo = window.storageInfo || window.webkitStorageInfo; 
    	   
    	   window.storageInfo.requestQuota(PERSISTENT, 
    			   								1024*1024, 
    			   								function(grantedBytes) {window.requestFileSystem(window.PERSISTENT, grantedBytes, getFileSystem, fail);}, 
    			   								fail);
    	   return defer.promise;
   	   },
       
       fileWrite: function(file, data){
    	   
    	   function fail(e) {
    	        console.log("Error", e);
    	    }
    	   
    	   function getFileSystem (fileSystem) {
    	        fileSystem.root.getFile(file, {create: true, exclusive: false}, gotFileEntry, fail);
    	    }
    	   
    	   function gotFileEntry(fileEntry) {
    		    fileEntry.createWriter(gotFileWriter, fail);
    	    }
    	   
    	   function gotFileWriter(fileWriter) {

    		      fileWriter.onwriteend = function(e) {
    		        //console.log('Write completed.');
    		      };

    		      fileWriter.onerror = function(e) {
    		        console.log('Write failed: ' + e.toString());
    		      };

    		      // Create a new Blob and write it
    		      var blob = new Blob(data, {type: 'text/plain'});

    		      fileWriter.write(blob);
    	    }
    	   
    	   console.log("writing data to file", file);
    	   window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	   
    	   window.webkitStorageInfo.requestQuota(PERSISTENT, 
    			   								1024*1024, 
    			   								function(grantedBytes) {window.requestFileSystem(window.PERSISTENT, grantedBytes, getFileSystem, fail);}, 
    			   								fail);
       }
       
       
   }
   });


