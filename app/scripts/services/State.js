'use strict';

angular.module('CACMobile')
  .factory('State', function( ) {

   var observationIds = []
   var loading = false;

   return {
      setLoading: function (_loading) {
        loading = _loading;
      },
      getLoading: function () {
        return loading
      },
      setObsIds: function(pids) {
        observationIds = pids;
     },
      getObsIds: function() {
        return observationIds;
     }
  }
});
