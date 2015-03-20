angular.module('acMobile.services')
    .factory('acPromiseTimeout', function($q, $timeout) {
        var PromiseTimeout = function() {
            var self = this;
            self.id = Date.now();

            self.start = function(func, params, timeout) {
                var deferred = $q.defer();
                //console.log('starting timer id: ' + self.id);
                self.timer = $timeout(function() {
                    //  console.log(self.id + ': timeout exceeded : ' + timeout + 'ms');
                    deferred.reject('timeout');
                }, timeout);

                //$q.when(func.apply(this, params))
                func.apply(this, params)
                    .then(function(result) {
                        //console.log(self.id + ' timer resolved successfully and cancelled');
                        $timeout.cancel(self.timer);
                        deferred.resolve(result);
                    }, function(err) {
                        //console.log(self.id + ' error with request function');
                        //console.log(err);
                        $timeout.cancel(self.timer);
                        deferred.reject(err);
                    });
                return deferred.promise;
            }
        }
        return PromiseTimeout;
    });
