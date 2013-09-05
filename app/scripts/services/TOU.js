'use strict';

angular.module('CACMobile')
.service('TOU', function TOU() {
   var storage = window.localStorage;

   return {
      accepted: function() {
        var accepted = storage.getItem("accepted");
        return accepted == "1";
     },
     accept: function() {
        storage.setItem("accepted", "1");
     }
  }
});
