angular.module('acMobile.services')
    .service('acMobileSocialShare', function($q, $cordovaSocialSharing) {

        this.share = function(provider, link) {
            var message = "Check out my Mountain Information Network Report: ",
                image = null;

            if (provider == "twitter") {
                return $cordovaSocialSharing
                    .shareViaTwitter(message, image, link)
                    .then(onSuccess, onFail);
            } else if (provider == "facebook") {
                return $cordovaSocialSharing
                    .shareViaFacebook(message + " " + link, image, link)
                    .then(onSuccess, onFail);
            } else if (provider == "googleplus") {
                //experimental - not enabled yet!
                window.plugins.socialsharing.shareVia('com.google.android.apps.plus', message, null, null, link, onSuccess, onFail);
            } else {
                window.plugins.socialsharing.share(message, null, null, link, onSuccess, onFail);
            }
        };

        function onSuccess(result) {
            if (result) {
                console.log(result);
                return $q.when(result);
            }
        }

        function onFail(error) {
            console.log(error);
            return $q.reject(error);
        }
    });