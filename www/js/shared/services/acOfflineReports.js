angular.module('acMobile.services')
    .service('acOfflineReports', function($q, auth, store, acSubmission, fileArrayCreator, acUser, $ionicPlatform, $cordovaNetwork, $rootScope) {
        var self = this;

        this.queue = store.get('acReportQueue') || [];

        this.push = function(report, sources) {
            self.queue.push({
                report: angular.copy(report),
                fileSrcs: angular.copy(sources),
                attempts: 0
            });
            store.set('acReportQueue', self.queue);
        };

        function prepareFiles(item) {
            if (item.fileSrcs.length) {
                item.report.files = [];
                var promises = _.map(item.fileSrcs, function(source) {
                    return fileArrayCreator.processImage(source, true);
                });
                return $q.all(promises)
                    .then(function(blobs) {
                        _.each(blobs, function(blob) {
                            if (blob !== false) {
                                item.report.files.push(blob);
                            }
                        });
                        return $q.when(item);
                    })
                    .catch(function(error) {
                        return $q.reject(error);
                    });
            } else {
                return $q.when(item);
            }
        }

        function syncReport(item) {
            return prepareFiles(item)
                .then(function(item) {
                    return acSubmission.submit(item.report, null);
                })
                .catch(function(error) {
                    console.log("error: " + error.status);
                    item.attempts = parseInt(item.attempts) + 1;
                    return $q.when(error); //force the promise to resolve (not reject)
                });
        }


        function updateQueue(responses) {
            var retryQueue = [];
            _.each(responses, function(response, index) {
                if (response.data) {
                    console.log(response.data.subid);
                }
                if (response.status != 201 && self.queue[index].attempts < 3) {
                    retryQueue.push(self.queue[index]);
                }
            });
            self.queue = [];
            self.queue = angular.copy(retryQueue);
            store.set('acReportQueue', self.queue);
        }

        this.synchronize = function() {
            console.log("synchronize event activated");
            $ionicPlatform.ready().then(function() {
                if (self.queue.length && $cordovaNetwork.isOnline()) {
                    if (auth.isAuthenticated) {
                        var promises = [];
                        angular.forEach(self.queue, function(item) {
                            console.log("sending: " + item.report.title);
                            promises.push(syncReport(item));
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
            });

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