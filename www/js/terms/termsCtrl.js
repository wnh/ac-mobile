angular.module('acMobile.controllers')
.controller('TermsCtrl', function($scope, $timeout, $state, acTerms){
    $scope.acceptButtonText = "Accept";
    $scope.termsAccepted = acTerms.termsAccepted();
    if ($scope.termsAccepted) {
        $scope.acceptButtonText = "Accepted";
    }
    $scope.acceptTerms = function(){
        console.log("accepted");
        acTerms.acceptTerms();
        $scope.termsAccepted = acTerms.termsAccepted();
        $scope.acceptButtonText = "Accepted";
        $timeout(function(){
            $state.go('app.forecasts-map');
        },500);

    };
});