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
    
    //! filesystem is available iterate over our callacks that where registered when the API was not available yet
    var numItems = fileApi.callBacks.length;
    fileApi.fileSystem = fileSystem;
    fileApi.available = true;
    
    for (var i = 0; i < numItems; i++) {
  	  
      var func = fileApi.callBacks.pop();
  	  
      if(func != null)
      {
        console.log("Action from File API Callback stack performed")
        func();
      }
      else
      {
        console.error("null function pointer Data File API");
      }

  	}
    console.assert(fileApi.callBacks.length == 0, "Data.js callback not performed list length should be 0");
    //!
    console.log("getFileSystem");

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

  function fail(e) {console.error("Error with filesystem", e);}

    console.log(" Register Device Ready Call back for File API");
    
    DeviceReady.addEventListener(
      function () {
        //! HACK ! seems that we need to do things differently for phonegap and web maybe make this check actual device ?
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) //! \todo generalise this function //(window.webkitStorageInfo){// WEB
        {      
          //request quota fails on android / phonegap
          console.log("Device Ready File API");
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0 , getFileSystem, fail);
        } 
        else{ // Web
          // required to make web compliant
          window.webkitStorageInfo.requestQuota(window.PERSISTENT, 
          1024*1024, 
          function(grantedBytes) {window.requestFileSystem(window.PERSISTENT, grantedBytes, getFileSystem, fail);}, 
          fail);     
        }
    });
	   
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
 	       
 	      if (fileApi.available == true)
 	      {
          getFile();
 	      }
 	      else
 	      {
 	    	  //fileApi no available register callback so this gets called again when it is available
 	    	  console.log("API Not available callback has been registered file read ");
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

            if (append = true){
              fileWriter.seek(fileWriter.length);
            }

            function write(data_) {
              var blob = new Blob(data_, type);
              fileWriter.write(blob);
            }

            write(data);
          }

    	  function getFile(){ fileApi.fileSystem.root.getFile(fileName, {create: true}, gotFileEntry, fail);};
    	   
        if (fileApi.available == true)
        {
          getFile();
        }
        else
        {
          //fileApi no available register callback so this gets called again when it is available
          console.log("API Not available callback has been registered file write");
          fileApi.callBacks.push(getFile);
        }
    	   
    	},
   	//! } End filewrite
       
   }// End return
   
   }); //End Factory


