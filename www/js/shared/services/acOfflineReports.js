angular.module('acMobile.services')
    .service('acOfflineReports', function($q, auth, store, acSubmission, acUser, $ionicPlatform, $cordovaNetwork, $rootScope) {
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
                if (response.status != 201 && response.status != 5000) {
                    retryQueue.push(self.queue[index]);
                }
            });
            self.queue = [];
            self.queue = angular.copy(retryQueue);
            store.set('acReportQueue', self.queue);
        }

        this.synchronize = function() {
            console.log("synchronize activated");
            if (self.queue.length && $cordovaNetwork.isOnline()) {
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
                } else {
                    acUser.prompt('Please login to synchronize your stored reports');
                }
            }
        };

        this.cancelResumeSync = $ionicPlatform.on('resume', function() {
            console.log("resume event");
            self.synchronize();
        });
        this.cancelOnlineSync = $ionicPlatform.on('online', function() {
            console.log("online event");
            self.synchronize();
        });
        $rootScope.$on('userLoggedIn', self.synchronize);

        //app startup event - runs first time this service is instantiated.
        self.synchronize();
    });