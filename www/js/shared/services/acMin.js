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



        function removeSubmittedReport(item) {
            // if (item.report.files) {
            delete item.report.files;
            // }
            // if (item.submitting) {
            delete item.submitting;
            // }

            _.pull(self.queue, item);

            store.set('acReportQueue', self.queue);
            self.submittedReports.push(item);
            store.set('acSubmittedReports', self.submittedReports);
        }

        this.sendReport = function(item) {
            if (!auth.isAuthenticated) {
                return acUser.authenticate()
                    .then(function() {
                        return self.processAndSend(item);
                    })
                    .then(function(result) {
                        console.log(result);
                        return result;
                    })
                    .catch(function(error) {
                        console.log(error);
                        return $q.reject(error);
                    });
            } else {
                return self.processAndSend(item);
            }
        };

        this.processAndSend = function(item) {
            var deferred = $q.defer();
            prepareFiles(item)
                .then(function(item) {
                    return acSubmission.submit(item.report, null);
                })
                .then(function(result) {
                    if (result.data && !('error' in result.data)) {
                        item.report.subid = result.data.subid;
                        item.report.shareUrl = result.data.obs[0].shareUrl;
                        console.log('submission: ' + result.data.subid);
                        return item;
                    } else {
                        return $q.reject('error');
                    }
                })
                .then(function(item) {
                    console.log(item);
                    removeSubmittedReport(item);
                    deferred.resolve(item);
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
    });