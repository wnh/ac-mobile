angular.module('acMobile.services')
    .service('acMin', function($q, auth, store, acSubmission, fileArrayCreator, acUser, $ionicPlatform, $cordovaNetwork, $rootScope) {
        var self = this;

        this.draftReports = store.get('acReportQueue') || []; //keep name for backwards compatibility
        this.submittedReports = store.get('acSubmittedReports') || [];

        this.update = function(index, report, sources) {
            self.draftReports[index].report = angular.copy(report);
            self.draftReports[index].fileSrcs = angular.copy(sources);
            store.set('acReportQueue', self.draftReports);
        };

        this.save = function(report, sources) {
            self.draftReports.push({
                report: angular.copy(report),
                fileSrcs: angular.copy(sources)
            });
            store.set('acReportQueue', self.draftReports);
        };

        this.delete = function(item) {
            _.pull(self.draftReports, item);
            store.set('acReportQueue', self.draftReports);
        };

        this.edit = function(item) {
            //TODO
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
                    item.submitting = true;
                    return prepareFiles(item);
                })
                .then(function(item) {
                    var token = store.get('token');
                    return acSubmission.submit(item.report, token);
                })
                .then(function(result) {
                    item.submitted = false;
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
                    }
                    if (item.submitting) {
                        item.submitting = false;
                    }
                    deferred.reject(error);
                });

            return deferred.promise;
        };
    });
