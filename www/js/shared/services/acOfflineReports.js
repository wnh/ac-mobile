angular.module('acMobile.services')
    .service('acOfflineReports', function($q, auth, store, acSubmission, fileArrayCreator, acUser, $ionicPlatform, $cordovaNetwork, $rootScope) {
        var self = this;

        this.queue = store.get('acReportQueue') || [];

        this.push = function(report) {
            self.queue.push(report);
            store.set('acReportQueue', self.queue);
        };

        function prepareFiles(report) {
            if (report.imageSources.length) {
                console.log(report.imageSources);
                report.files = [];
                var promises = [];
                angular.forEach(report.imageSources, function(imageUrl) {
                    promises.push(fileArrayCreator.processImage(imageUrl, true));
                });
                return $q.all(promises)
                    .then(function(result) {
                        angular.forEach(result, function(fileBlob) {
                            console.log('got a file blob');
                            report.files.push(fileBlob);
                        });
                        return report;
                    })
                    .catch(function(error) {
                        console.log(error);
                        //if there's an error, we'll log it but still submit the report without files.
                    });
            } else {
                return $q.when(report);
            }
        }

        function syncReport(report) {
            return prepareFiles(report)
                .then(function(report) {
                    return acSubmission.submit(report, null)
                        .catch(function(error) {
                            console.log("error: " + error.status);
                            return $q.when(error); //force the promise to resolve (not reject)
                        });
                });
        }

        function updateQueue(responses) {
            var retryQueue = [];
            angular.forEach(responses, function(response, index) {
                if (response.data) {
                    console.log(response.data.subid);
                }
                if (response.status) {
                    console.log(response.status);
                }
                if (response.status != 201 && response.status != 500) {
                    retryQueue.push(self.queue[index]);
                }
            });
            self.queue = [];
            self.queue = angular.copy(retryQueue);
            store.set('acReportQueue', self.queue);
        }

        this.synchronize = function() {
            console.log("synchronize activated");
            $ionicPlatform.ready().then(function() {
                if (self.queue.length && $cordovaNetwork.isOnline()) {
                    if (auth.isAuthenticated) {
                        var promises = [];
                        angular.forEach(self.queue, function(report) {
                            console.log("sending: " + report.title);
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