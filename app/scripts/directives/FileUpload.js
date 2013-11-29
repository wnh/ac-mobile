'use strict';

angular.module('CACMobile')
.directive('fileUpload', function ($parse) {

    var linker = function ($scope, element, attributes) {
        // onChange, push the file to the object in ngModel
        element.bind('change', function (event) {
            var model = $parse(attributes.fileUpload)
            var file = event.target.files[0];
            $scope.$apply(function () {
               model.assign($scope,file.name);
            });
        });
    };

    return {
        restrict: 'A',
        link: linker
    };

});
