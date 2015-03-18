angular.module('acMobile.services')
    .factory('acPromiseTimeout', function($q, $timeout) {
        return function(func, params, timeout) {
            var deferred = $q.defer();

            var timer = $timeout(function() {
                console.log('timeout exceeded : ' + timeout + 'ms');
                deferred.reject('timeout');

            }, timeout);

            $q.when(func.apply(this, params)).then(function(result) {
                $timeout.cancel(timer);
                deferred.resolve(result);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };
    });
