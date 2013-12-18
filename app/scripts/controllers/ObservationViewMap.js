'use strict';

angular.module('CACMobile')
.controller('ObservationViewMapCtrl', function ($scope, location, ResourceFactory, Bounds, $timeout, $modal, $log, State) {
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

    State.setLoading(true);

      //TODO: Some rate control here?
      var b = Bounds.getBounds();

      if (b.set == true)
      {
        if (b.zoom > 10) {
          $log.info("View un-clustered");
           ResourceFactory.location().query({nelon: b.nelon, nelat: b.nelat, swlon: b.swlon, swlat: b.swlat, clustered: false, from: $scope.from.toDateString(), to: $scope.to.toDateString()},
              function(response) {
                $log.info("Location query response " + response.length);
                $scope.locations = response;
               State.setLoading(false);
              },
              function(response) {
                $log.error("Failed to load unclustered locations");
                State.setLoading(false);
              })
        }
        else
        {
          $log.info("View clustered");
           ResourceFactory.location().query({nelon: b.nelon, nelat: b.nelat, swlon: b.swlon, swlat: b.swlat, clustered: true, from: $scope.from.toDateString(), to: $scope.to.toDateString()},
              function(response) {
                $log.info("Location query response "+ response.length);
                $scope.locations = response;
               State.setLoading(false);
              },
              function(response) {
                $log.error("Failed to load clustered locations");
                State.setLoading(false);
              })
        }
      }
      else
      {
        $log.error("Bounds not set");
      }
   }
      //! Get the current position
      getPostion();

      $scope.$watch(function() {return Bounds.getBounds();},
         function(oldval,newval) {
              $log.info("Bounds updated");
              getLocations();
         },true);

      $scope.to = State.getToDate();
      $scope.from = State.getFromDate();
      $scope.today = new Date();


  $scope.$watch(function() {return $scope.to},
    function(oldval,newval) {
      if (oldval != newval) {
        getLocations();
        State.setToDate($scope.to);
      }
      else
      {
        $log.warn("Old From Date and New From Date are the same");
      }
    },true)

    $scope.$watch(function() {return $scope.from},
    function(oldval,newval) {
      if (oldval != newval) {
        getLocations();
        State.setFromDate($scope.from);
      }
      else
      {
        $log.warn("Old From Date and New From Date are the same");
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
