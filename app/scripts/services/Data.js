'use strict';
//Provides services for getting Data from HTTP and local file
//Does not use any instance specific information instead acts as a facade wrapper


// allows  cross origin requests
angular.module('CACMobile')
.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


angular.module('CACMobile')
.factory('Data', function($http,$rootScope,$q, DeviceReady){

	   //! setup file
	 var fileApi = {available : false, callBacks : []};

	 window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

	   function getFileSystem (fileSystem) {

		      fileApi.fileSystem = fileSystem;
		      fileApi.available = true;
		      
		      //! filesystem is available iterate over our callacks that where registered when the API was not available yet
		      for (var i = 0; i < fileApi.callBacks.length; i++) {
		    	  var func = fileApi.callBacks.pop();
		    	  func ? func() : console.assert(func != NULL, "null function pointer");
		    	}
		      //!
		      
		      console.log("getFileSystem");
	   }

	   function fail(e) {console.error("Error with filesystem", e);}
	
	
	   //! HACK ! seems that we need to do things differently for phonegap and web maybe make this check actual device ?
	   if (window.webkitStorageInfo){// WEB
	      
        // required to make web compliant
	      window.webkitStorageInfo.requestQuota(window.PERSISTENT, 
	   				1024*1024, 
	   				function(grantedBytes) {window.requestFileSystem(window.PERSISTENT, grantedBytes, getFileSystem, fail);}, 
	   				fail);	   
	   } 
	   else{ // Phonegap

      DeviceReady.addEventListener(function () {
        //request quota fails on android / phonegap
         console.log("Device Ready");
         window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 , getFileSystem, fail);
      });
		    
	   }
	   
   return {
	   
	   //HTTP Get XML and use transform function to convert to json
	   //{
       httpGetXml: function(url,transform){
     	    var defer = $q.defer();    	   
    	   	
     	    console.log ("requesting data from " + url);
            
    	   	$http.get(
                url,
                {transformResponse:transform}
            ).
            success(function(data, status) {
                //console.log("Request succeeded");
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
       //! } End httpGetXml
   
       //HTTP Get json
       httpGetJson: function(url){
    	   var defer = $q.defer();    	   
	   	
    	   console.log ("requesting data from " + url);
       
	   		$http.get(url).
	   		success(function(data, status) {
	   			//console.log("Request succeeded");
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
       //! } End httpGetJson
   	   	
   	   //! Read a local file {
   	   fileRead: function(fileName){
   		
   		   //console.groupCollapsed("File Read");
   		   
   		   var defer = $q.defer();    	 
   		   
   		   function failAndUpdate(e) {
   			   console.log("Error reading file", e);
   			   defer.reject(e);
   			   $rootScope.$apply();
   		   }
 	   
 	       function gotFileEntry(fileEntry) {
 	    	   console.log("gotFileEntry", fileName);  
 	    	   fileEntry.file(readFile, failAndUpdate);
 	       }
 	       
 	       function readFile(fileEntry) {
 	    	   
 	    	   var reader = new FileReader();
 	    	   
 	    	   reader.onloadend  = function(e) {
 	    		   //var json = JSON.parse(this.result);
 	    		   defer.resolve(e.target.result);
 	    		   $rootScope.$apply();
 	    	   };
 	    	   
 	    	   reader.onError = function(e) {
 	    		   console.log('error'); 
 	    		   defer.reject(e);
 	    		   $rootScope.$apply();
 	    	   };
 	    	   
           try{
 	    	     reader.readAsText(fileEntry);
           }
           catch (e){
            console.error("error reading file", e);
           }

 	       }

 	      function getFile(){ fileApi.fileSystem.root.getFile(fileName, {create: false, exclusive: true}, gotFileEntry, failAndUpdate); }
 	       
 	      if (fileApi.available)
 	      {
 	    	 getFile();
 	      }
 	      else
 	      {
 	    	  //fileApi no available register callback so this gets called again when it is available
 	    	  console.log("API Not available callback has been registered");
 	    	  fileApi.callBacks.push(getFile);
 	      }
   		
 	      
    	  return defer.promise;
   	   },
       //! } End fileRead
       
   	   //! Write to a local file {
       fileWrite: function(fileName, data, type, append){
    	   
    	   //console.groupCollapsed("FileWrite"); events are asyncronous so we cant group
    	   
    	   function gotFileEntry(fileEntry) {
    		    fileEntry.createWriter(gotFileWriter, fail);
    	    }
    	   
    	   function gotFileWriter(fileWriter) {
    		   
              fileWriter.writeStart = function(e){
                console.log("data write start");
              }

          	 fileWriter.onwrite = function(e) {
          		   console.log("Data writting to file", fileName);
      		   };
      		   
      		   fileWriter.onwriteend = function(e) {
        		   console.log("Data written to file", fileName);
    		     };

    		     fileWriter.onerror = function(e) {
    			     console.error('Write failed: ' + e.toString());
    		     };

           


           //T \todo his sets the position if left out the file is overwritten. a param should be passed to conditionall apply this
           if (append = true){
              fileWriter.seek(fileWriter.length);
           }
    		   
           function write(data_) {
              var blob = new Blob(data_, type);
              fileWriter.write(blob);
           }

           //console.log("writing data", data);

           write(data);
           /*
           //if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) 
           if (true)
           {
              var chunkSize = 100;
              chunkSize = data.length < chunkSize ? data.length : chunkSize;  

              var numChunks = data.length / chunkSize;

              for (var i = 0; i < data.length; i += chunkSize)
              {
                write(data.slice(i, (i+chunkSize)-1));
                //fileWriter.seek(i);  
              }
           }
           else
           {
              write(data);
           }*/

    	    }
    	   
    	   function getFile(){ fileApi.fileSystem.root.getFile(fileName, {create: true}, gotFileEntry, fail);};
    	   
    	   if (fileApi.available)
    	   {
    		   getFile();
    	   }
    	   else
    	   {
    		   //fileApi no available register callback so this gets called again when it is available
  	    	  console.log("API Not available callback has been registered");
  	    	  fileApi.callBacks.push(getFile);
  	     }
    	   
    	   //console.groupEnd();
    	   
    	},
   	//! } End filewrite
       
   }// End return
   
   }); //End Factory


