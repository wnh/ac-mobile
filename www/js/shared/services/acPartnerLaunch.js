angular.module('acMobile.services')
    .service('acPartnerLaunch', function($cordovaAppAvailability) {

        //todo externalize to config options
        var mecIOSScheme = 'fb206084672860640://';
        var mecAndroidScheme = "com.mec.app.placeholder";
        var mecFallBackUrl = "http://www.mec.ca";
        var testScheme = "default.will.fail.placeholder.ac";

        this.mec = function(fallBackLink) {
            if (ionic.Platform.isIOS()) {
                testScheme = mecIOSScheme;
            } else if (ionic.Platform.isAndroid()) {
                testScheme = mecAndroidScheme;
            }
            $cordovaAppAvailability
                .check(testScheme)
                .then(function(success) {
                        window.open(testScheme, '_self', 'location=no');
                    },
                    function(error) {
                        // app not installed
                        if (fallBackLink) {
                            window.open(fallBackLink, '_system', 'location=no');
                        } else {
                            window.open(mecFallBackUrl, '_system', 'location=no');
                        }

                    });
        };
        this.tecterra = function(fallBackLink) {
            window.open(fallBackLink, '_system', 'location=no');
        };
    });
