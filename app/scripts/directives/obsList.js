'use strict';

angular.module('CACMobile')
  .directive('obsList', function ($compile) {

   var linker = function (scope, element, attrs) {
         var tableHeader = ["Location","Submitted","User","Photos"];
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
               retHTML += "<p ng-click=\"loadPhoto(" + ids[i] + ")\"><a>Photo</a></p>";
            }
            return retHTML;
         }
         var buildTable = function () {
            var tbody = document.createElement('tbody');
            element.append(tbody);
            for(var j=0;j<scope.observations.length;j++) {
              if (scope.observations[j].visibility == "public"){
                 trow = document.createElement("tr");
                 tbody.appendChild(trow);
                 trow.appendChild(document.createElement("td")).appendChild(document.createTextNode(scope.observations[j].location_name));
                 trow.appendChild(document.createElement("td")).appendChild(document.createTextNode(scope.observations[j].submitted_at));
                 trow.appendChild(document.createElement("td")).appendChild(document.createTextNode("todo"));
                 if (scope.observations[j].photo_id != null) {
                    trow.appendChild(document.createElement("td")).innerHTML = photoLink(scope.observations[j].photo_id);
                 }
              }
            }
            var compiled = $compile(tbody);
            compiled(scope);
         }

         scope.$watch('observations',buildTable);
      }

    return {
      restrict: 'A',
      link: linker
    }
;  });
