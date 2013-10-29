'use strict';

angular.module('CACMobile')
  .factory('uploadService', ['$rootScope', function ($rootScope) {
    return {
        send: function (obs,scope) {
            var data = new FormData(),
                xhr = new XMLHttpRequest();

            //var fileInput = document.getElementById('file-input');
            //var file = fileInput.files[0];
            data.append('file', obs.file);
            data.append('token',obs.token)
            data.append('latitude',obs.latitude)
            data.append('longitude',obs.longitude)
            if (obs.altitude != null) {
               data.append('altitude',obs.altitude)
            }  
            if (obs.accuracy != null) {
               data.append('accuracy',obs.accuracy)
            }
            if (obs.altitudeAccuracy != null) {
               data.append('altitude_accuracy',obs.altitudeAccuracy)
            }    
            data.append('recorded_at',obs.recordedAt)
            data.append('type',obs.type)
            xhr.open('POST', 'http://obsnet.herokuapp.com/observation',false);
            xhr.send(data);
            scope.uploadComplete(xhr.response);
        }
    };

}]);