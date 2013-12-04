'use strict';

angular.module('CACMobile')
  .factory('State', function( ) {

   var observationIds = []

   return {
      setObsIds: function(pids) {
        observationIds = pids;
     },
      getObsIds: function() {
        return observationIds;
     }
  }
});
