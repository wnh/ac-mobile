'use strict';

angular.module('CACMobile')
  .factory('ResourceFactory',['$resource', 'platform','$log','$rootScope', function ($resource, platform, $log, $rootScope) {

    function FileTransferSim(){};
    FileTransferSim.prototype.upload = function (obj, url, success, fail, options)
    {
      $log.info("File Transfer Upload Simulated");
      $log.info("url", url);
      $log.info("options", options);
      success(null);
    }

    function FileUploadOptionsSim(){};
    FileUploadOptionsSim.prototype.fileKey = "";
    FileUploadOptionsSim.prototype.fileName = "";
    FileUploadOptionsSim.prototype.mimeType = "";
    FileUploadOptionsSim.prototype.chunkedMode = false;
    FileUploadOptionsSim.prototype.params = {};

    var FileTransfer = FileTransfer || FileTransferSim; //( FileTransfer ? new FileTransfer() : new FileTransferSim() );
    var FileUploadOptions =  FileUploadOptions || FileUploadOptionsSim; //new FileUploadOptions() || new FileUploadOptionsSim();//( FileUploadOptions ? new FileUploadOptions() : new FileUploadOptionsSim());

    //! \todo should be config param
    var apiUrl = "http://0.0.0.0:9999";//"http://obsnet.herokuapp.com";//"http://0.0.0.0:9999";

    return {

      //! \todo comment
      comment: function (){
        var commentObj = $resource(apiUrl+'/comment', {},
        {
          create: { method: 'POST' },
          get:    { method: 'GET', isArray:false, url: apiUrl+'/comment/:id'}
        });

        return commentObj;
      },

      //! \todo comment
      user: function (){
        var userObj = $resource(apiUrl+'/user', {},
        {
          all: { method: 'GET'}//, isArray:true }
        });

        return userObj;
      },


      //! \todo comment
      session: function (){
        var sessionObj = $resource(apiUrl+'/session', {},
        {
          create: { method: 'POST' },
          destroy: {method: 'DELETE', isArray:false, url: apiUrl+'/session/:token'}
        });

        return sessionObj;
      },

      //! \todo comment
      observation: function (){
        var obsObj = $resource(apiUrl+'/observation', {},
        {
          get: { method: 'GET', url: apiUrl+'/observation/:id'},
          create: { method: 'POST' }
        });

        return obsObj;
      },

      //! \todo comment
      role: function (){
        var roleObj = $resource(apiUrl+'/role', {},
        {
          all: { method: 'GET', isArray:true }
        });

        return roleObj;
      },

      region: function(){

        var regionObj = $resource(apiUrl+'/region', {},
        {
          get: { method: 'GET' }
        });

        return regionObj;
      },

      /*//! \todo comment
      comment: function (){
        var roleObj = $resource(apiUrl+'/comment/:id', {},{})
        return roleObj;
      },*/

      //! \todo comment
      photo: function (){
        var photoObj = $resource(apiUrl+'/photo', {},
        {
          get: { method: 'GET', url: apiUrl+'/photo/:id'},
        });

        //! Cannot post file obj using resource instead overwrite the save function
        photoObj.create = function (obj, success, fail)
          {

              //! upload image to s3
              var uploadS3 = function(params)
              {

                  var s3URI    = encodeURI("https://"+ params.bucket +".s3.amazonaws.com/");

                  var ft = new FileTransfer();
                  var options = new FileUploadOptions();

                  options.fileKey = "file";
                  options.fileName = params.fileName;
                  options.mimeType = "image/jpeg";
                  options.chunkedMode = false;
                  options.params = {
                      "key":params.fileName,
                      "AWSAccessKeyId": params.awsKey,
                      "acl": params.acl,
                      "policy": params.policy,
                      "signature": params.signature,
                      "Content-Type": "image/jpeg"
                  };



                  ft.upload(obj.image, s3URI,
                      function (e) {
                          $log.info("Image uploaded to s3. Return Value", e);
                          uploadPhotoData(params.fileName);
                      },
                      function (e) {
                          $log.error("Image failed to upload to s3");
                          fail(e);
                      }, options);
              }

              //! upload data inc s3 url to API
              var uploadPhotoData = function (fileName)
              {
                /*
                var ft      = new FileTransfer();
                var options = new FileUploadOptions();

                options.fileKey = "photo_data";
                options.fileName = fileName;
                options.mimeType = "text/plain";
                options.chunkedMode = false;
                //options.chunkedMode = false;
                options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                    "token": obj.token,
                    "observation_id": obj.observation_id,
                    "comment": obj.comment,
                    "imageId": fileName
                };

                ft.upload(obj.image,
                          apiUrl + '/photo',
                          function (result) {
                            //success(result.response);
                            $rootScope.$apply();
                          },
                          function (e) {
                            fail(e);
                            $rootScope.$apply();
                          },
                          options);
                */

                var params = { "token": obj.token,
                               "observation_id": obj.observation_id,
                               "comment": obj.comment,
                               "image_id": fileName};

                var photoDataApi = $resource(apiUrl+'/photo', {},
                {
                  create: { method: 'POST'}
                });

                photoDataApi.create(params,
                                 function(result){
                                  $log.info("Photo added to database", result);
                                  success(result.response);
                                 },
                                 function(error){
                                  $log.error(error);
                                  fail(error);
                                 });
              }

              //! Request S3 params from server
              var s3Params = $resource(apiUrl+'/s3', {},
              {
                get: { method: 'GET'}
              });

              s3Params.get({token: obj.token},
                           function(data){
                            $log.info("S3 paramaters recieved", data);
                            uploadS3(data)
                           },
                           function(error){
                            $log.error(error)
                           });

          }

          return photoObj;

      },

      //! \todo comment
      location: function (){
        var locObj = $resource(apiUrl+'/location', {},
        {
          create: {method: 'POST'},
          get: {method: 'GET', url: apiUrl+'/location/:id'}
        });

        return locObj;
      }


    };
  }]);
