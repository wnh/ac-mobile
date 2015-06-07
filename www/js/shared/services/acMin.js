angular.module('acMobile.services')
    .service('acMin', function($q, auth, store, acPromiseTimeout, acSubmission, acFileService, acUser, $ionicPlatform, $ionicLoading, $cordovaNetwork, $rootScope) {
        var self = this;


        this.draftReports = store.get('acReportQueue') || []; //keep name for backwards compatibility
        this.submittedReports = store.get('acSubmittedReports') || [];

        this.globalSubmitting = false;

        this.purgeStoredData = function() {
            self.draftReports = [];
            self.submittedReports = [];
            store.remove('acReportQueue');
            store.remove('acSubmittedReports');
        };

        this.storeDraftReports = function() {
            var tempReports = angular.copy(self.draftReports);
            _.each(tempReports, function(item) {
                delete item.submitting;
                delete item.error;
            });
            store.set('acReportQueue', tempReports);
        };

        this.update = function(index, report, sources) {
            var targetReport = angular.copy(report);
            self.draftReports[index].report = angular.copy(targetReport);
            self.draftReports[index].fileSrcs = angular.copy(sources);
            self.storeDraftReports();
        };

        this.save = function(report, sources) {
            var targetReport = angular.copy(report);
            self.draftReports.push({
                report: angular.copy(targetReport),
                fileSrcs: angular.copy(sources)
            });
            self.storeDraftReports();
        };

        this.delete = function(item) {
            if (item.fileSrcs.length) {
                var cleanUp = _.map(item.fileSrcs, function(filePath) {
                    return acFileService.delete(filePath);
                });
                $q.all(cleanUp).then(function() {
                    console.log('image data deleted');
                });
            }
            _.pull(self.draftReports, item);
            self.storeDraftReports();
        };

        function prepareFiles(item) {
            if (item.fileSrcs.length) {
                item.report.files = [];
                var promises = _.map(item.fileSrcs, function(source) {
                    return acFileService.processImage(source, true);
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

        function markReportSubmitted(item) {
            self.delete(item);
            self.submittedReports.push({
                report: {
                    subid: item.report.subid,
                    title: item.report.title,
                    datetime: item.report.datetime,
                    shareUrl: item.report.shareUrl
                }
            });
            store.set('acSubmittedReports', self.submittedReports);
        }

        this.sendReport = function(item) {
            var deferred = $q.defer();
            acUser.authenticate()
                .then(function() {
                    if (item.error) {
                        item.error = false;
                    }
                    self.globalSubmitting = true;
                    item.submitting = true;
                    return prepareFiles(item);
                })
                .then(function(item) {
                    var token = store.get('token');
                    var promTime = new acPromiseTimeout();
                    return promTime.start(acSubmission.submit, [item.report, token], 10000 + (120000 * item.report.files.length));
                })
                .then(function(result) {
                    self.globalSubmitting = false;
                    item.submitting = false;
                    if (result.data && !('error' in result.data)) {
                        item.report.subid = result.data.subid;
                        item.report.shareUrl = result.data.obs[0].shareUrl;
                        console.log('submission: ' + result.data.subid);
                        markReportSubmitted(item);
                        if (item.fileSrcs.length) {
                            var cleanUp = _.map(item.fileSrcs, function(filePath) {
                                return acFileService.delete(filePath);
                            });
                            $q.all(cleanUp).then(function() {
                                console.log('image data deleted');
                            });
                            deferred.resolve(item); // we don't really care if an error occurs during deletion, the report was submitted.
                        } else {
                            deferred.resolve(item);
                        }

                    } else {
                        return $q.reject('error');
                    }
                })
                .catch(function(error) {
                    console.log(error);
                    if (angular.isObject(error) && error.status == 401) {
                        acUser.logout();
                        acUser.prompt('There was a problem with your credentials, please login and try again');
                    } else {
                        $ionicLoading.show({
                            template: 'There was an error submitting your report. Please check your connection and try again.',
                            duration: 2500
                        });
                    }
                    item.error = true;
                    if (item.submitting) {
                        item.submitting = false;
                    }
                    self.globalSubmitting = false;
                    deferred.reject(error);
                });

            return deferred.promise;
        };



    });
