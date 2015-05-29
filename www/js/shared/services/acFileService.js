angular.module('acMobile.services')
    .service('acFileService', function($cordovaFile, $q, $window) {

        this.delete = function(path) {
            return getFileFromURI(path)
                .then(deleteFile);
        };

        this.saveImagePersistently = function(imagePath) {
            var fileEntry, name;

            return getFileFromURI(imagePath).then(function(result) {
                    fileEntry = result;
                    name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    return getFileFromURI(cordova.file.dataDirectory);
                })
                .then(function(targetEntry) {
                    return copyFile(fileEntry, targetEntry, name);
                })
                .catch(function(error) {
                    console.log(error);
                    return $q.reject(error);
                });
        };

        function deleteFile(entry) {
            var deferred = $q.defer();
            entry.remove(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        function copyFile(sourceEntry, targetEntry, targetName) {
            var deferred = $q.defer();
            sourceEntry.copyTo(targetEntry, targetName, deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        function moveFile(entry, name, target) {
            var deferred = $q.defer();
            entry.moveTo(target, name, deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        function getFileFromURI(url) {
            var deferred = $q.defer();
            $window.resolveLocalFileSystemURL(url, deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        this.processImage = function(imagePath, ignoreErrors) {
            ignoreErrors = ignoreErrors || false;
            var arr = imagePath.split('/');
            var filename = arr.pop();
            var path = arr.join('/');

            return $cordovaFile.readAsArrayBuffer(path, filename)
            .then(function(result) {
                    var fileType = getType(filename);
                    var newBlob = new Blob([result], {
                        type: fileType,
                        size: result.byteLength
                    });
                    return newBlob;
                })
                .catch(function(error) {
                    console.log(error);
                    if (!ignoreErrors) {
                        return $q.reject(error);
                    }
                    console.log('image errors ignored');
                    return $q.when(false);
                });
        };



        function getType(filename) {
            var arr = filename.split(".");
            if (arr.length === 1) {
                return 'image/jpeg';
            } else {
                var ext = arr.pop();
                if (ext === "jpg" || "jpeg") {
                    return 'image/jpeg';
                } else if (ext === "png") {
                    return 'image/png';
                } else {
                    return 'image/jpeg';
                }
            }
        }

        function readSuccess(deferred, file) {
            return function(event) {
                var fileType;
                fileType = file.type || getType(file.name);

                var newBlob = new Blob([event.target.result], {
                    type: fileType,
                    size: file.size
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
