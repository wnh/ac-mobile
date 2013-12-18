'use strict';

angular.module('CACMobile')
  .factory('Bounds', function ($log, $rootScope) {

      var nelon = 0;
      var nelat = 0;
      var swlon = 0;
      var swlat = 0;

      var zoom = 6;
      var set = false;

    return {
        setBounds: function (pnelon,pnelat,pswlon,pswlat,pzoom) {
            nelon = pnelon;
            nelat = pnelat;
            swlon = pswlon;
            swlat = pswlat;
            zoom = pzoom;
            set = true;

            $log.info('bounds set', nelon, nelat, swlon, swlat, zoom);
            $rootScope.$apply();
        },
        getBounds: function () {
         return {
            nelon: nelon,
            nelat: nelat,
            swlon: swlon,
            swlat: swlat,
            zoom: zoom,
            set: set
         }
        }
    };s
});
