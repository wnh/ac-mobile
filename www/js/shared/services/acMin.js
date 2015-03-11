angular.module('acMobile.services')
    .service('acMin', function($q, auth, store, acSubmission, fileArrayCreator, acUser, $ionicPlatform, $cordovaNetwork, $rootScope) {
        var self = this;

        this.queue = store.get('acReportQueue') || []; //keep name for backwards compatibility

        this.submittedReports = store.get('acSubmittedReports') || [];

        this.save = function(report, sources) {
            self.queue.push({
                report: angular.copy(report),
                fileSrcs: angular.copy(sources),
                attempts: 0
            });
            store.set('acReportQueue', self.queue);
        };

        this.markSubmitted = function(item) {
            if (item.report.files) {
                delete item.report.files;
            }
            if (item.submitting) {
                delete item.submitting;
            }
            self.submittedReports.push(item);
            store.set('acSubmittedReports', self.submittedReports);
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

        // function syncReport(item) {
        //     return prepareFiles(item)
        //         .then(function(item) {
        //             return acSubmission.submit(item.report, null);
        //         })
        //         .catch(function(error) {
        //             console.log("error: " + error.status);
        //             item.attempts = parseInt(item.attempts) + 1;
        //             return $q.when(error); //force the promise to resolve (not reject)
        //         });
        // }

        function removeSubmittedReport(item) {
            var tempCopy = angular.copy(self.queue);
            console.log(tempCopy);
            if (item.report.files) {
                delete item.report.files;
            }
            _.pull(self.queue, item);
            console.log('new Queue');
            console.log(self.queue);
            store.set('acReportQueue', self.queue);
            self.submittedReports.push(item);
            store.set('acSubmittedReports', self.submittedReports);
        }

        this.sendReport = function(item) {
            return self.processAndSend(item).then(function(result) {
                    return (result);
                })
                .catch(function(error) {
                    console.log(error);
                    if (error === 'notLoggedIn') {
                        //attempt to login the user with stored token and/or refresh token, if not, prompt.
                        acUser.prompt("You are not logged in");
                    } else if (error === 'offline') {

                    } else {
                        //error during submission, won't do anything to the queues.
                    }

                });
        };

        this.processAndSend = function(item) {
            console.log('sending..');
            var deferred = $q.defer();
            if ($cordovaNetwork.isOnline() || true) {
                if (auth.isAuthenticated) {
                    prepareFiles(item)
                        .then(function(item) {
                            return acSubmission.submit(item.report, null);
                        })
                        .then(function(result) {
                            if (result.data && !('error' in result.data)) {
                                item.report.subid = result.data.subid;
                                item.report.shareUrl = result.data.obs[0].shareUrl;
                                console.log('submission: ' + result.data.subid);
                                return result;
                            } else {
                                return $q.reject('error');
                            }
                        })
                        .then(function(response) {
                            console.log(response);
                            removeSubmittedReport(item);
                            deferred.resolve(item);
                        })
                        .catch(function(error) {
                            deferred.reject(error);
                        });

                } else {
                    deferred.reject('notLoggedIn');
                }
            } else {
                deferred.reject('offline');
            }
            return deferred.promise;
        };

        // this.uploadReport = function(item) {
        //     $ionicPlatform.ready().then(function() {
        //         if ($cordovaNetwork.isOnline()) {
        //             if (auth.isAuthenticated) {
        //                 console.log('submitting: ' + item.report.title);
        //                 return syncReport(item)
        //                     .then(removeUploadedReport)
        //                     .catch(function(error) {
        //                         console.log(error);
        //                         return $q.reject(error);
        //                     });

        //             } else {
        //                 acUser.prompt('Please login to synchronize your stored reports');
        //                 //JPB-TODO: after logging in, remember the report that was attempted and submit it!
        //             }

        //         } else {
        //             //JPB-TODO device is offline - message, or change the state of the form and don't allow this to happen.

        //         }
        //     });
        // };



    });