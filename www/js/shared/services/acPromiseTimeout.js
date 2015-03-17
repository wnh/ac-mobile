angular.module('acMobile.services')
    .factory('acPromiseTimeout', function($q, $timeout) {
        return function(func, params, timeout) {
            var deferred = $q.defer();

            var timer = $timeout(function() {
                deferred.reject('timeout exceeded : ' + timeout + 'ms');

            }, timeout);

            $q.when(func(params)).then(function(result) {
                $timeout.cancel(timer);
                deferred.resolve(result);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };
    });
