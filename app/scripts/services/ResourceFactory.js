'use strict';

angular.module('CACMobile')
  .factory('ResourceFactory',['$resource', 'platform','$log','$rootScope', function ($resource, platform, $log, $rootScope) {

    //! \todo should be config param
    var apiUrl = "http://0.0.0.0:9999";

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
          all: { method: 'GET', isArray:true }
        });

        return regionObj;
      }

      /*//! \todo comment
      comment: function (){
        var roleObj = $resource(apiUrl+'/comment/:id', {},{})
        return roleObj;
      },*/

      //! \todo comment
      photo: function (){
        var photoObj = $resource(apiUrl+'/photo', {},
        {
          get: { method: 'GET', url: apiUrl+'/photo/:id'}
        });

        //! Cannot post file obj using resource instead overwrite the save function
        photoObj.create = function (obj, success, fail)
          {

              //! upload image to s3
              var uploadS3 = function(params)
              {

                  var ft = new FileTransfer();
                  var options = new FileUploadOptions();

                  options.fileKey = "file";
                  options.fileName = fileName;
                  options.mimeType = "image/jpeg";
                  options.chunkedMode = false;
                  options.params = {
                      "key":obj.image.substr(obj.image.lastIndexOf('/') + 1); ,
                      "AWSAccessKeyId": params.awsKey,
                      "acl": params.acl,
                      "policy": params.policy,
                      "signature": params.signature,
                      "Content-Type": "image/jpeg"
                  };

                  ft.upload(obj.image, s3URI,
                      function (e) {
                          uploadPhotoData(e);
                      },
                      function (e) {
                          fail(e);
                      }, options);
              }

              //! upload data inc s3 url to API
              var uploadPhotoData = function (url){
                var ft      = new FileTransfer();
                var options = new FileUploadOptions();

                options.fileKey = "photo_data";
                options.fileName = url
                options.mimeType = "text/plain";
                options.chunkedMode = false;
                //options.chunkedMode = false;
                options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                    "token": obj.token,
                    "observation_id": obj.observation_id,
                    "comment": obj.comment,
                    "imageUrl": url
                };

                ft.upload(obj.image,
                          apiUrl + '/photo',
                          function (result) {
                            success(result.response);
                            $rootScope.$apply();
                          },
                          function (e) {
                            fail(e);
                            $rootScope.$apply();
                          },
                          options);
                }
              }

              if (platform.isMobile() == true)
              {

                //! Request S3 params from server
                var s3Params = $resource(apiUrl+'/s3', {},
                {
                  get: { method: 'GET', isArray:true}
                });

                s3Params.get(function(data){uploadS3(data)});

              }
              else
              {
                $log.warn("No image upload function available for web, image upload skipped");
                var response = {'id':123};
                success(response);
              }

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
