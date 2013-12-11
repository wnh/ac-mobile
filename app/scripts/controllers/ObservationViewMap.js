'use strict';

angular.module('CACMobile')
.controller('ObservationViewMapCtrl', function ($scope, location, ResourceFactory, Bounds, $timeout, $modal, $log) {
   $scope.latitude = 50.9831700;
   $scope.longitude = -118.2023000;
   $scope.locations = [];

   function getPostion () {
      location.getPosition().then(
         function (position){
            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;
         });
   }

   function getLocations () {
    console.log("updating locations...")
      //TODO: Some rate control here?
      var b = Bounds.getBounds();
      if (b.zoom > 8) {
         ResourceFactory.location().query({nelon: b.nelon, nelat: b.nelat, swlon: b.swlon, swlat: b.swlat, clustered: false, from: $scope.from, to: $scope.to},
            function(response) {
               $scope.locations = response;
            },
            function(response) {
               console.log("Failed to load unclustered locations")
            })
      }
      else 
      {
         ResourceFactory.location().query({nelon: b.nelon, nelat: b.nelat, swlon: b.swlon, swlat: b.swlat, clustered: true, from: $scope.from, to: $scope.to},
            function(response) {
               $scope.locations = response;
            },
            function(response) {
               console.log("Failed to load clustered locations")
            })
      }
   }
      //! Get the current position
      getPostion();
      
      $scope.$watch(function () { return Bounds.getBounds(); },
         function(oldval,newval) {
            if (oldval != newval) {
               getLocations();
            }
         },true);
      $scope.to = new Date();
      $scope.from = new Date();
      $scope.today = new Date();


  $scope.$watch(function() {return $scope.to},
    function(oldval,newval) {
      if (oldval != newval) {
        getLocations();
      }
    },true)

    $scope.$watch(function() {return $scope.from},
    function(oldval,newval) {
      if (oldval != newval) {
        getLocations();
      }
    },true)

      //! Load Date Picker Modal Dialog

 $scope.toOpen = function () {
      var modalInstance = $modal.open({
        templateUrl: 'dateModal.html',
        controller: dateModalCtrl,
        resolve: {
          date: function () {
            return {value: $scope.to};
          },
          minDate: function () {
            return $scope.from;
          },
          today: function () {
            return $scope.today;
          }
         }
      });
      modalInstance.result.then(function (date) {
        $scope.to = date;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
};

 $scope.fromOpen = function () {
      var modalInstance = $modal.open({
        templateUrl: 'dateModal.html',
        controller: dateModalCtrl,
        resolve: {
          date: function () {
            return {value: $scope.from}
          },
          minDate: function () {
            return null;
          },
          today: function () {
            return $scope.today;
          }
         }
      });
      modalInstance.result.then(function (date) {
        $scope.from = date;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
};

var dateModalCtrl = ['$scope', '$modalInstance', 'date', 'minDate', 'today', function ($scope, $modalInstance, date, minDate, today) {
  $scope.dt = date;
  $scope.minDate = minDate;
  $scope.today = today;
  $scope.ok = function () {
    $modalInstance.close($scope.dt.value);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}];
//! End Date Picker Modal Dialog

});
