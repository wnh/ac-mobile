angular.module('acMobile.services')
    .service('fileArrayCreator', function($cordovaFile, $q) {
        this.processImage = function(imagePath, ignoreErrors) {
            ignoreErrors = ignoreErrors || false;
            return $cordovaFile.readFileMetadataAbsolute(imagePath)
                .then(createBlob)
                .catch(function(error) {
                    if (!ignoreErrors) {
                        return $q.reject(error);
                    }
                });
        };

        function createBlob(file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onloadend = readSuccess(deferred, file);
            reader.onerror = readError(deferred);
            reader.readAsArrayBuffer(file);
            return deferred.promise;
        }

        function readSuccess(deferred, file) {
            return function(event) {
                var newBlob = new Blob([event.target.result], {
                    "type": file.type
                });
                deferred.resolve(newBlob);
            };
        }

        function readError(deferred) {
            return function(error) {
                deferred.reject(error);
            };
        }
    });