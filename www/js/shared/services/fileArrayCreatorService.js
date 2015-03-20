angular.module('acMobile.services')
    .service('fileArrayCreator', function($cordovaFile, $q, $window) {


        this.saveImagePersistently = function(imagePath) {
            console.log('---- start ----');
            console.log(imagePath);
            var filename = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var filepath = imagePath.substr(0, imagePath.lastIndexOf('/'));
            console.log(filename);
            console.log(filepath);
            //return $q.when(imagePath);
            console.log(cordova.file.dataDirectory);

            //$window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError);
            var fileEntry;
            console.log('attempting getFileFromURI');
            return getFileFromURI(imagePath).then(function(result) {

                    fileEntry = result;
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);

                    console.log('attempting createDIR');
                    console.log('folder:' + cordova.file.dataDirectory + '/min-image');

                    return getFileFromURI(cordova.file.dataDirectory);
                })
                .then(function(targetEntry) {
                    return copyFile(fileEntry, targetEntry, name)

                }).then(function(success) {
                    console.log('done!');
                    console.log(success);
                    return success;
                })
                .catch(function(error) {
                    console.log('err');
                    console.log(error);
                });

        }

        function copyFile(sourceEntry, targetEntry, targetName) {
            var deferred = $q.defer();
            sourceEntry.copyTo(targetEntry, targetName, function(success) {
                    deferred.resolve(success);
                },
                function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function moveFile(entry, name, target) {
            var deferred = $q.defer();
            entry.moveTo(target, name, function(result) {
                deferred.resolve(result);
            }, function(error) {
                deferred.reject(error);
            })
            return deferred.promise;
        }

        function getFileFromURI(url) {
                var deferred = $q.defer();
                $window.resolveLocalFileSystemURL(url, function(result) {
                    deferred.resolve(result);
                }, function(error) {
                    deferred.reject(result);

                })
                return deferred.promise;
            }
            // return $cordovaFile.moveFile(filepath, filename, cordova.file.dataDirectory)
            //     .then(function (result) {
            //         console.log(result);
            //     // success
            //     }, function (error) {
            // // error
            // });
            //}

        // function moveFile(fileEntry) {
        //     var d = new Date();
        //     var n = d.getTime();
        //     //new file name
        //     var newFileName = n + ".jpg";
        //     var myFolderApp = "min-images";

        //     $window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
        //             //The folder is created if doesn't exist
        //             fileSys.root.getDirectory(myFolderApp, {
        //                     create: true,
        //                     exclusive: false
        //                 },
        //                 function(directory) {
        //                     entry.moveTo(directory, newFileName, successMove, resOnError);
        //                 },
        //                 resOnError);
        //         },
        //         resOnError);

        // }


        this.processImage = function(imagePath, ignoreErrors) {
            ignoreErrors = ignoreErrors || false;
            return $cordovaFile.readFileMetadataAbsolute(imagePath)
                .then(createBlob)
                .catch(function(error) {
                    if (!ignoreErrors) {
                        return $q.reject(error);
                    }
                    return $q.when(false);
                });
        };

        // these functions are used to cache an image if the device allows edits
        // this.storeFiles = function(report, queueIndex) {
        //     return $cordovaFile.createDir('avalanche', false)
        //         .then(function() {
        //             var promises = [];
        //             angular.forEach(report.files, function(data) {
        //                 var filepath = 'avalanche/' + moment.unix() + '-img';
        //                 promises.push(writeFile(filepath, data));
        //             });
        //             return $q.all(promises);
        //         });
        // };


        // function writeFile(filepath, data) {
        //     console.log('writing:' + filepath);
        //     return $cordovaFile.writeFile(filepath, data, {})
        //         .then(function(result) {
        //             console.log("wrote file:" + filepath);
        //             return $q.when(filepath);
        //         })
        //         .catch(function(error) {
        //             console.log(angular.toJson(error));
        //             console.log("error writing file.");
        //             return $q.when(false);
        //         });
        // }

        function createBlob(file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onloadend = readSuccess(deferred, file);
            reader.onerror = readError(deferred);
            reader.readAsArrayBuffer(file);
            return deferred.promise;
        }

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
