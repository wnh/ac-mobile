'use strict';

angular.module('CACMobile')
  .controller('RegionDetailsCtrl', function ($scope, $routeParams, $location, Forecast, Data, RegionDefinition) {
    $scope.loading = true;
    $scope.region = null;

    function getForecast() {
        Forecast.get($scope.region).then(
                    function(fx){

                         //data = data_;
                         //$scope.data = data;

                         $scope.loading = false;

                         $scope.today = fx.today;
                         $scope.tomorrow = fx.tomorrow;
                         $scope.dayAfter = fx.dayAfter;
                         $scope.confidence = fx.confidence;

                         //$scope.valid = fx.validTime.TimePeriod; //! valid.beginPosition.__text | valid.endPosition.__text
                         //$scope.valid.issued = $scope.valid.beginPosition.__text.replace("T"," ");
                         //$scope.valid.expires = $scope.valid.endPosition.__text.replace("T"," ");


                         $scope.valid = { issued : fx.validTime.issued,
                                          expires : fx.validTime.expires}

                        var regions = RegionDefinition.get();
                        $scope.regionDisplayName = regions[$scope.region].display;

                        //! seriously there has to be a better way !
                       // for(var i = 0; i < regions.length; ++i)
                       // {
                       //     if(regions[i].name = $scope.region)
                       //     {
                       //         $scope.regionDisplayName = regions[i].display;
                       //     }
                       // }


                    },
                    function(error){
                        console.error('error getting forecast', error);
                    }

            );
    } // end function getForecast


    if (RegionDefinition.exists($routeParams.region) == false)
    {
      alert("No data feed currently available for this region, sorry for the inconvenience");
      $location.path('/');
    }
    else
    {
      $scope.region = $routeParams.region;
      getForecast();
    }





  });
