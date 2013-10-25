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
            xhr.open('POST', 'http://127.0.0.1:9999/observation',false);
            xhr.send(data);
            scope.uploadComplete(xhr.response);
        }
    };

}]);

angular.module('CACMobile')
.directive('fileChange', function () {

    var linker = function ($scope, element, attributes) {
        // onChange, push the file to $scope.obs.file.
        element.bind('change', function (event) {
            var file = event.target.files[0];
            $scope.$apply(function () {
               $scope.obs.file = file;
            });
        });
    };

    return {
        restrict: 'A',
        link: linker
    };

});
