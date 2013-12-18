'use strict';

angular.module('CACMobile')
  .directive('modalPhoto', [function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var img = document.createElement('img');
        img.src = scope.photo.links.image.href;
        img.className = "modal-photo";
        element.append(img);
        var comment = document.createElement('p');
        comment.appendChild(document.createTextNode(scope.photo.comment));
        element.append(comment);
      }
    };
  }]);
