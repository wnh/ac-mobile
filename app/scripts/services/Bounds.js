'use strict';

angular.module('CACMobile')
  .factory('Bounds', function () {
     
      var nelon = 0;
      var nelat = 0;
      var swlon = 0;
      var swlat = 0;

      var zoom = 6;

    return {
        setBounds: function (pnelon,pnelat,pswlon,pswlat,pzoom) {
            nelon = pnelon;
            nelat = pnelat;
            swlon = pswlon;
            swlat = pswlat;
            zoom = pzoom;
        },
        getBounds: function () {
         return {
            nelon: nelon,
            nelat: nelat,
            swlon: swlon,
            swlat: swlat,
            zoom: zoom
         }
        }
    };s
});