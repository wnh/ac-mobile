'use strict';

angular.module('CACMobile')
  .factory('ResourceFactory', function ($resource) {

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
        photoObj.create = function (obj)
          {
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
            //scope.uploadComplete(xhr.response);
          }

          return photoObj;

      },

      //! \todo comment
      location: function (){
        var locObj = $resource(apiUrl+'/location', {},
        {
          all: { method: 'GET', isArray:true }
        });

        return locObj;
      }


    };
  });
