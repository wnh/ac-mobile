'use strict';

angular.module('CACMobile')
  .factory('Bounds', function () {
     
      var nelon = 0;
      var nelat = 0;
      var swlon = 0;
      var swlat = 0;

    return {
        setBounds: function (pnelon,pnelat,pswlon,pswlat) {
            nelon = pnelon;
            nelat = pnelat;
            swlon = pswlon;
            swlat = pswlat;
        },
        getBounds: function () {
         return {
            nelon: nelon,
            nelat: nelat,
            swlon: swlon,
            swlat: swlat
         }
        }
    };s
});