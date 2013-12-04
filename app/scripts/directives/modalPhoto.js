'use strict';

angular.module('CACMobile')
  .directive('modalPhoto', [function () {
    return {
      template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
         console.log("Is this being run")
        var img = document.createElement('img');
        img.src = scope.photo.links.image.href;
        element.append(img);
        var comment = document.createElement('p');
        comment.appendChild(document.createTextNode("Comment:" + scope.photo.comment));
        element.append(comment);
      }
    };
  }]);
