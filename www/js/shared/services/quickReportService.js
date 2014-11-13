angular.module('acMobile.services')
    .service('quickReports', function($http, $q) {
        //Service API
        return {
            sendReport: sendReport,
            getReports: getReports,
            getReport: getReport
        };

        //public
        function sendReport() {
            var request = $http({
                method: 'post',
                headers: {
                    'Content-Type': 'unknown'
                },
                url: '/api/report',
                data: {},

            });
            return request
                .then(onSucces, onError);
        }

        function getReports() {}

        function getReport(id) {}

        //private
        function onError(error) {
            console.error(error);
            return $q.reject(error);
        }

        function onSuccess(response) {
            console.log(response);
            return response.data;
        }

    });
