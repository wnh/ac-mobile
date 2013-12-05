'use strict';

angular.module('CACMobile')
  .directive('setLocationMap', [function () {
    return {
      template: '<div></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
         var myLatLng = new google.maps.LatLng(scope.location.latitude,scope.location.longitude);
         var mapOptions = {zoom: 6, streetViewControl: false, zoomControl: false, center: myLatLng, mapTypeId: google.maps.MapTypeId.TERRAIN};
         var map = new google.maps.Map(element[0], mapOptions);
         var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title:"Submission Location"
         });

         var moveMarker = function(marker,latlng) {
            marker.setPosition(latlng)
            scope.$apply(scope.location.latitude = latlng.lat());
            scope.$apply(scope.location.longitude = latlng.lng());
         }

         google.maps.event.addListener(map, 'click', function(event) {
            moveMarker(marker,event.latLng)
         });
      }
    };
  }]);
