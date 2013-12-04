'use strict';

angular.module('CACMobile')
  .directive('obsList', function ($compile) {

   var linker = function (scope, element, attrs) {
         var tableHeader = ["ID","Submitted","Recorded","Photos"];
         var thead = document.createElement('thead');
         var trow = document.createElement("tr");
         element.append(thead);
         thead.appendChild(trow)
         for(var i=0;i<tableHeader.length;i++){
            trow.appendChild(document.createElement("th")).appendChild(document.createTextNode(tableHeader[i]));
         }

         var photoLink = function (ids) {
            var retHTML = "";
            for(var i = 0; i<ids.length;i++) {
               retHTML += "<p ng-click=\"loadPhoto(" + ids[i] + ")\">Photo</p>";
            }
            return retHTML;
         }
         var buildTable = function () {
            var tbody = document.createElement('tbody');
            element.append(tbody);
            for(var j=0;j<scope.observations.length;j++) {
               trow = document.createElement("tr");
               tbody.appendChild(trow);
               trow.appendChild(document.createElement("td")).appendChild(document.createTextNode(scope.observations[j].id));
               trow.appendChild(document.createElement("td")).appendChild(document.createTextNode(scope.observations[j].submitted_at));
               trow.appendChild(document.createElement("td")).appendChild(document.createTextNode(scope.observations[j].recorded_at));
               trow.appendChild(document.createElement("td")).innerHTML = photoLink(scope.observations[j].photo_id);
            }
            var compiled = $compile(tbody);
            compiled(scope);
         }

         scope.$watch('observations',buildTable);
      }

    return {
      template: '<div></div>',
      restrict: 'A',
      link: linker
    }
;  });
