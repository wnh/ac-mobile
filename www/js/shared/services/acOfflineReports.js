angular.module('acMobile.services')
    .service('acOfflineReports', function($q, auth, store, acSubmission, $ionicPlatform) {
        var self = this;

        this.queue = store.get('acReportQueue') || [];

        this.push = function(report) {
            self.queue.push(report);
            store.set('acReportQueue', self.queue);
        };

        function syncReport(report) {
            return acSubmission.submit(report, null)
                .catch(function(error) {
                    return $q.when(error); //force the promise to resolve (not reject)
                });
        }

        function updateQueue(responses) {
            var retryQueue = [];
            angular.forEach(responses, function(response, index) {
                console.log(response);
                if (response.status != 201 && response.status != 500) {
                    retryQueue.push(self.queue[index]);
                }
            });
            self.queue = [];
            self.queue = angular.copy(retryQueue);
            store.set('acReportQueue', self.queue);
        }

        this.synchronize = function() {
            if (self.queue.length) {
                if (auth.isAuthenticated) {
                    var promises = [];
                    angular.forEach(self.queue, function(report) {
                        console.log("queued to send:" + report.title);
                        promises.push(syncReport(report));
                    });
                    return $q.all(promises)
                        .then(updateQueue)
                        .catch(function(error) {
                            console.log('an error occurred synchronizing data');
                            return $q.reject(error);
                        });
                }
            } else {
                //do authentication

            }
        };

        this.cancelResumeSync = $ionicPlatform.on('resume', self.synchronize);
        this.cancelOnlineSync = $ionicPlatform.on('online', self.synchronize);

        self.synchronize();
    });