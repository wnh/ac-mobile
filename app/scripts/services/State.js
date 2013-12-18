'use strict';

angular.module('CACMobile')
  .factory('State', function( ) {

   var observationIds = []
   var loading = false;
   var toDate = new Date();
   var fromDate = new Date();

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
     },
     setToDate: function(date){
        toDate = date;
     },
     setFromDate: function(date){
        fromDate = date;
     },
     getToDate: function(){
        return toDate;
     },
     getFromDate: function(){
        return fromDate;
     },
  }
});
