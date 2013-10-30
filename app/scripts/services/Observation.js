'use strict';

angular.module('CACMobile')
  .factory('Observation', function( $resource ) {
   return $resource('http://obsnet.herokuapp.com/observation', {}, {
      all: {
         method: 'GET',
         isArray:true
      }
   });
});