'use strict';

angular.module('CACMobile')
  .factory('Observation', function( $resource, $location ) {

   var ids = []

   return {
      setIds: function(pids) {
        ids = pids;
     },
      getIds: function() {
        return ids;
     }
  }
});
