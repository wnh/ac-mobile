angular.module('acMobile.services')
    //    .constant('AC_API_ROOT_URL', 'http://avalanche-canada-env.elasticbeanstalk.com')
    .constant('AC_QA_API_ROOT_URL', 'http://avalanche-canada-qa-cyhmatrj4r.elasticbeanstalk.com');

angular.module('acMobile.services')
    .factory('acReport', function($http, $q, AC_QA_API_ROOT_URL) {

        var apiUrl = AC_QA_API_ROOT_URL; //todo use config value to pick URL

        //public API
        return {
            prepareData: prepareData,
            sendReport: sendReport,
            getReports: getReports,
            getReport: getReport
        };


        //public
        function prepareData(reportData) {
            var fd = new FormData();
            //process files
            if (reportData.files && reportData.files.length > 0) {
                angular.forEach(reportData.files, function(file, counter) {
                    //check file type image/video for now just image
                    if (file) {
                        fd.append('file' + counter, file, "image-" + counter + ".jpg");
                    }
                });
            }

            //process data
            angular.forEach(reportData, function(value, key) {
                if (key !== "files" && angular.isObject(value)) {
                    fd.append(key, angular.toJson(value));
                } else if (key === "datetime") {
                    fd.append(key, moment(value).format());
                } else if (key !== "files") {
                    fd.append(key, value);
                }
            });
            return $q.when(fd);
        }

        function sendReport(formData) {
            return $http.post(apiUrl + '/api/min/submissions', formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(onSuccess)
                .error(onError);
        }

        function getReports() {}

        function getReport(id) {}

        //private
        function onError(error) {
            //console.error(error);
            return $q.reject(error);
        }

        function onSuccess(response) {
            console.log(response);
            return response.data;
        }

    });
