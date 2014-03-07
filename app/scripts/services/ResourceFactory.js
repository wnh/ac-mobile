'use strict';

angular.module('CACMobile')
  .factory('ResourceFactory',['$resource', 'platform','$log','$rootScope', function ($resource, platform, $log, $rootScope) {

    //! \todo should be config param
    var apiUrl = "http://obsnet.herokuapp.com";//"http://0.0.0.0:9999";

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

              //! upload image to s3 using paramaters retrieved from server
              var uploadS3 = function(params)
              {

                  params.acl   = 'public-read';
                  var s3URI    = encodeURI("https://"+ params.bucket +".s3.amazonaws.com/");
                  var uploadComplete = function (e) {
                                          $log.info("Image uploaded to s3. Return Value", e.response);
                                          uploadPhotoData(params.fileName);
                                        }
                  var uploadFailed   = function (e) {
                                          $log.error("Image failed to upload to s3", e);
                                          fail(e);
                                       }

                  if (platform.isMobile() == true)
                  {
                    var ft = new FileTransfer();
                    var options = new FileUploadOptions();

                    options.fileKey = "file";
                    options.fileName = params.fileName;
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = false;
                    options.headers = { Connection: "close" };
                    options.params = {
                        "key":params.fileName,
                        "AWSAccessKeyId": params.awsKey,
                        "acl": params.acl,
                        "policy": params.policy,
                        "signature": params.signature,
                        "Content-Type": "image/jpeg"
                    };

                    $log.info("options", options);
                    $log.info("image", obj.image);

                    ft.upload(obj.image,
                              s3URI,
                              uploadComplete,
                              uploadFailed,
                              options);
                  }
                  else
                  {
                    //var file = document.getElementById('image').files[0];
                    var fd = new FormData();

                    $log.info(params);

                    fd.append('key', params.fileName);
                    fd.append('AWSAccessKeyId',  params.awsKey);
                    fd.append('acl', params.acl);
                    fd.append('policy', params.policy)
                    fd.append('signature',params.signature);
                    fd.append('Content-Type', "image/jpeg");

                    fd.append("file",obj.file);

                    $log.info(fd);

                    var xhr = new XMLHttpRequest();

                    xhr.addEventListener("load", uploadComplete, false);
                    xhr.addEventListener("error", uploadFailed, false);
                    xhr.open('POST', s3URI, true); //MUST BE LAST LINE BEFORE YOU SEND

                    xhr.send(fd);
                  }
              }

              //! upload photo to API include name of file on s3. Stores in database and creates photo object
              var uploadPhotoData = function (fileName)
              {

                var params = { "token": obj.token,
                               "observation_id": obj.observation_id,
                               "comment": obj.comment,
                               "image_id": fileName};

                // dont want to expose this publicly so instead create a new photo resource locally
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
                            uploadS3(data);
                           },
                           function(error){
                            $log.error(error);
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
