'use strict';

angular.module('CACMobile')
  .directive('connectionState', function (ConnectionManager) {
    return  function (scope, element, attrs) {

        var connectionState = 'unknown';

        
      	function getState () {
      		connectionState = ConnectionManager.state();
      	}

      	ConnectionManager.online(getState);
		ConnectionManager.offline(getState);
		
        element.text(connectionState);
    };
  });
