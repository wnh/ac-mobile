'use strict';

angular.module('CACMobile')
  .factory('State', function( ) {

   var observationIds = []
   var loading = false;
   var toDate = new Date();
   var fromDate = new Date();
   // set fromDate to yesterday
   fromDate.setDate(fromDate.getDate() - 1);

   var map = true;

   //! observation
   var submission = {'comment':"" ,'locationName': "", 'photo_list': [], 'locationPos':{latitude:50.9831700, longitude: -118.2023000}, 'positionDesc':"Unknown"};

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
     setSubmissionValue: function(param, val){
      submission[param] = val;
     },
     getSubmissionValue: function(param){
       return submission[param];
     },
     getMap: function(){
       return map;
     },
     setMap: function(param){
       map = param;
     }

  }
});
