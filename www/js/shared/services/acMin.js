angular.module('acMobile.services')
    .service('acMin', function($q, auth, store, acPromiseTimeout, acSubmission, fileArrayCreator, acUser, $ionicPlatform, $ionicLoading, $cordovaNetwork, $rootScope) {
        var self = this;

        this.draftReports = store.get('acReportQueue') || []; //keep name for backwards compatibility
        this.submittedReports = store.get('acSubmittedReports') || [];

        this.globalSubmitting = false;

        this.purgeStoredData = function() {
            store.remove('acReportQueue');
            store.remove('acSubmittedReports');
        };

        this.storeDraftReports = function() {
            _.each(self.draftReports, function(item) {
                delete item.submitting;
                delete item.error;
            });
            store.set('acReportQueue', self.draftReports);
        }
        this.update = function(index, report, sources) {
            self.draftReports[index].report = angular.copy(report);
            self.draftReports[index].fileSrcs = angular.copy(sources);
            self.storeDraftReports();
        };

        this.save = function(report, sources) {
            self.draftReports.push({
                report: angular.copy(report),
                fileSrcs: angular.copy(sources)
            });
            self.storeDraftReports();

        };

        this.delete = function(item) {
            _.pull(self.draftReports, item);
            self.storeDraftReports();
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
                    return promTime.start(acSubmission.submit, [item.report, token], 5000 + (120000 * item.report.files.length));
                })
                .then(function(result) {
                    self.globalSubmitting = false;
                    item.submitting = false;
                    if (result.data && !('error' in result.data)) {
                        item.report.subid = result.data.subid;
                        item.report.shareUrl = result.data.obs[0].shareUrl;
                        console.log('submission: ' + result.data.subid);
                        markReportSubmitted(item);
                        deferred.resolve(item);
                    } else {
                        return $q.reject('error');
                    }
                })
                .catch(function(error) {
                    console.log(error);
                    if (angular.isObject(error) && error.status == 401) {
                        acUser.logout();
                        acUser.prompt('There was a problem with your credentials, please login and try again');
                    } else if (error === 'timeout') {
                        $ionicLoading.show({
                            template: 'Submitting your report took too long. Please try again with a faster internet connection',
                            duration: 2500
                        });
                    } else {
                        $ionicLoading.show({
                            template: 'There was a problem submitting your report. Please ensure you have an internet connection',
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


        $ionicPlatform.on('resume', function(e) {
            this.draftReports = store.get('acReportQueue') || [];
            this.submittedReports = store.get('acSubmittedReports') || [];
        });
    });
