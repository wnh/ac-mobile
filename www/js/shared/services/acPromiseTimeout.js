angular.module('acMobile.services')
    .factory('acPromiseTimeout', function($q, $timeout) {
        return function(func, timeout) {
            var deferred = $q.defer();

            var timer = $timeout(function() {
                deferred.reject('timeout reached : ' + timeout + 'ms');
            }, timeout);

            $q.when(func()).then(function(result) {
                $timeout.cancel(timer);
                deferred.resolve(result);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };
    });