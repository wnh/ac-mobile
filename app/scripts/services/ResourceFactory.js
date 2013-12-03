'use strict';

angular.module('CACMobile')
  .factory('ResourceFactory',['$resource', function ($resource) {

    //! \todo should be config param
    var apiUrl = "http://obsnet.herokuapp.com";

    return {

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
          create: { method: 'POST' }
        });

        return sessionObj;
      },

      //! \todo comment
      observation: function (){
        var obsObj = $resource(apiUrl+'/observation', {},
        {
          get: { method: 'GET', isArray:true },
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

      //! \todo comment
      photo: function (){
        var photoObj = $resource(apiUrl+'/photo', {},
        {});

        //! Cannot post file obj using resource instead overwrite the save function
        //! \todo put a betetr description/comment here LN ?
        photoObj.create = function (obj, callback)
          {

            alert(obj.image);

            var ft      = new FileTransfer();
            var options = new FileUploadOptions();

            options.fileKey = "image";
            options.fileName = obj.image.substr(obj.image.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                "token": obj.token,
                "observation_id": obj.observation_id,
                "comment": obj.comment,
                "image": obj.image
            };

            ft.upload(obj.image, apiUrl + '/photo',
                function (e) {
                    alert("upload success");
                },
                function (e) {
                    alert("Upload failed");
                }, options);

            /*
            alert(obj.image);

            var data = new FormData(),
                xhr = new XMLHttpRequest();

            //var fileInput = document.getElementById('file-input');
            //var file = fileInput.files[0];

            data.append('token', obj.token);
            data.append('observation_id', obj.observation_id);
            data.append('comment', obj.comment);
            data.append('image', obj.image);

            //! \todo is there a better way of doing this ?
            xhr.open('POST', apiUrl+'/photo' ,false);
            xhr.send(data);

            //! \todo feedback ?
            callback(xhr.response); */

          }

          return photoObj;

      },

      //! \todo comment
      location: function (){
        var locObj = $resource(apiUrl+'/location', {},
        {
          create: {method: 'POST'}
        });

        return locObj;
      }


    };
  }]);
