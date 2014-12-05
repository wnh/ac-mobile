angular.module('acMobile.services')
    .service('acMobileSocialShare', function($q) {

        this.share = function(provider, link, message, image) {
            var deferred = $q.defer();
            message = message || null;
            image = image || null;

            if (provider == "twitter") {
                //return $cordovaSocialSharing
                // .shareViaTwitter(message, image, link)
                // .then(onSuccess, onFail);
                window.plugins.socialsharing.shareViaTwitter(message, image, link, onSuccess(deferred), onFail(deferred));
            } else if (provider == "facebook") {
                // return $cordovaSocialSharing
                //     .shareViaFacebook(message + " " + link, image, link)
                // .then(onSuccess, onFail);
                window.plugins.socialsharing.shareViaFacebook(message, image, link, onSuccess(deferred), onFail(deferred));
            } else if (provider == "googleplus") {
                //experimental - not enabled yet!
                window.plugins.socialsharing.shareVia('com.google.android.apps.plus', message, null, null, link, onSuccess(deferred), onFail(deferred));
            } else {
                window.plugins.socialsharing.share(message, null, image, link, onSuccess(deferred), onFail(deferred));
            }
            return deferred.promise;
        };

        function onSuccess(deferred) {
            return function(result) {
                deferred.resolve(result);
            };
        }

        function onFail(deferred) {
            return function(error) {
                console.log(error);
                deferred.reject(error);
            };
        }
    });