angular.module('acMobile.services')
    .service('acTerms', function(store) {
        this.acceptTerms = function(){
            store.set('acTermsAccepted', "true");
        };
        this.termsAccepted = function(){
            var accepted = store.get('acTermsAccepted');
            return accepted == "true";
        };

    });
