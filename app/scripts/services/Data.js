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

	   //! setup file
	 var fileApi = {available : false};

	 window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

	   function getFileSystem (fileSystem) {
		      fileApi.fileSystem = fileSystem;
		      fileApi.available = true;
		      console.log("getFileSystem");
	   }

	   function fail(e) {console.log("Error", e);}
	
	
	   //! HACK ! seems that we need to do things differently for phonegap and web
	   if (window.webkitStorageInfo){// WEB
	      
		  // required to make web compliant
	      window.webkitStorageInfo.requestQuota(window.PERSISTENT, 
	   				1024*1024, 
	   				function(grantedBytes) {window.requestFileSystem(window.PERSISTENT, grantedBytes, getFileSystem, fail);}, 
	   				fail);	   
	   } 
	   else{ // Phonegap
		   
		   document.addEventListener('deviceready', function () {
	          //request quota fails on android / phonegap
			   var grantedBytes = 0;
			   window.requestFileSystem(window.PERSISTENT, grantedBytes , getFileSystem, fail);
			}, false);   
	   }
	   
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
                //$rootScope.$apply();
            }).
            error(function(data, status) {
                console.log("Request failed " + status);
                defer.reject(status);
                //$rootScope.$apply();
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
	   			//$rootScope.$apply();
	   			}).
	   		error(function(data, status) {
	   			console.log("Request failed " + status);
	   			defer.reject(status);
	   			//$rootScope.$apply();
	   		});
       
	   		return defer.promise;
       },
       
       // HTTP Put data to URL
       httpPut: function(url, data){
    	    //console.log ("putting data at " + url);
   	   		$http.put(url, data);
   	   	},
   	   	
   	   //Read a local file
   	   fileRead: function(fileName){
   		
   		   var defer = $q.defer();    	 
   		   
   		   function failAndUpdate(e) {
   			   console.log("Error", e);
   			   defer.reject(e);
   			   $rootScope.$apply();
   		   }
 	   
 	       /*function getFileSystem (fileSystem) {
 	    	   fileName =  file;
 	    	   console.log("getFileSystem", fileName);
 	    	   fileSystem.root.getFile(fileName, {create: false, exclusive: true}, gotFileEntry, failAndUpdate);
 	       }*/
 	   
 	       function gotFileEntry(fileEntry) {
 	    	   console.log("gotFileEntry", fileName);  
 	    	   fileEntry.file(readFile, failAndUpdate);
 	       }
 	       
 	       function readFile(fileEntry) {
 		 	 console.log("reading data from file", fileName);
 	    	 var reader = new FileReader();
 	         reader.onloadend  = function(e) {
 	        	 	defer.resolve(this.result);
 	        	 	$rootScope.$apply();
 	        	 };
 	         reader.onError = function(e) {
 	        	 	console.log('error'); 
 	        	 	defer.reject(e);
 	        	 	$rootScope.$apply();
 	        	 };
 	         reader.readAsText(fileEntry);
 	       }

 	      if (fileApi.available)
 	      {
 	    	  fileApi.fileSystem.root.getFile(fileName, {create: false, exclusive: true}, gotFileEntry, failAndUpdate);
 	      }
 	      else
 	      {
 	    	  failAndUpdate("API Not available");
 	      }
   		
    	  return defer.promise;
   	   },
       
   	   // Write to a local file
       fileWrite: function(fileName, data){

    	   //if (fileApi.available){
    	///	   alert("winning");
    	   //}
    		   
   
    	   //function fail(e) {
    	    //    console.log("Error", e);
    	    //}
    	   
    	   
    	   /*function getFileSystem (fileSystem) {
    		   fileName =  file; 
    		   console.log("getFileSystem ", fileName);
    		   fileSystem.root.getFile(fileName, {create: true}, gotFileEntry, fail);
    	    }*/
    	   
    	   function gotFileEntry(fileEntry) {
    		    console.log("gotFileEntry");
    		    fileEntry.createWriter(gotFileWriter, fail);
    	    }
    	   
    	   function gotFileWriter(fileWriter) {
    		   console.log("gotFileEntry");
    		   
          	   fileWriter.onwrite = function(e) {
          		   console.log("Data writting to file", fileName);
      		   };
      		   
      		 fileWriter.onwriteend = function(e) {
        		   console.log("Data written to file", fileName);
    		   };

    		   fileWriter.onerror = function(e) {
    			   console.log('Write failed: ' + e.toString());
    		   };

    		   var blob = new Blob(data, {type: 'text/plain'});

    		   console.log("file Write begun to file", fileName);
    		   fileWriter.write(blob);
    	    }
    	   

    	   if (fileApi.available)
    	   {
    		   fileApi.fileSystem.root.getFile(fileName, {create: true}, gotFileEntry, fail);
    	   }
    	   else
    	   {
    		   fail("API Not available");
    	   }
    	   
    	   //window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    	   
    	   //window.webkitStorageInfo.requestQuota(PERSISTENT, 
    	//		   								1024*1024, 
    		//	   								function(grantedBytes) {window.requestFileSystem(window.PERSISTENT, grantedBytes, getFileSystem, fail);}, 
    			//   								fail);*/
       }
       
       
   }
   });


