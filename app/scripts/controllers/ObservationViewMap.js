'use strict';

angular.module('CACMobile')
.controller('ObservationViewMapCtrl', function ($scope, location, ResourceFactory, Bounds, $timeout, $modal, $log, State) {
   $scope.latitude = 50.9831700;
   $scope.longitude = -118.2023000;
   $scope.locations = [];

   $scope.map = true;
   $scope.showMap = function () { 
    $scope.map = true; 
    };
   $scope.showList = function () {
    $scope.map = false;
    setAllObservationIds();
   };

   function setAllObservationIds() {
    var observation_ids = [];
    for(var i=0;i<$scope.locations.length;i++) {
      observation_ids = observation_ids.concat($scope.locations[i].observation_id)
    }
    State.setObsIds(observation_ids)
   }

   function getPostion () {
      location.getPosition().then(
         function (position){
            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;
         });
   }

   var newBounds = false;

   function checkLocationRequests() {
    State.setLoading(false);
    if (newBounds == true) {
      $log.info("Now performing cached request");
      newBounds = false;
      getLocations();
    } else {
      //If we're not about to perform another lookup, and $scope.map is false, update the State with the new observation ids
      if ($scope.map == false) {
        setAllObservationIds();
      }
    }
  }

   function getLocations () {
      var b = Bounds.getBounds();
      if (b.set == true)
      {
        if (State.getLoading() == true) {
          newBounds = true;
        } else {
          State.setLoading(true);
          if (b.zoom > 10) {
            $log.info("View un-clustered");
            ResourceFactory.location().query({nelon: b.nelon, nelat: b.nelat, swlon: b.swlon, swlat: b.swlat, clustered: false, from: $scope.from.toDateString(), to: $scope.to.toDateString()},
              function(response) {
                $log.info("Location query response " + response.length);
                $scope.locations = response;
                checkLocationRequests();
              },
              function(response) {
                $log.error("Failed to load unclustered locations");
                checkLocationRequests();
              })
          }
          else
          {
            $log.info("View clustered");
            ResourceFactory.location().query({nelon: b.nelon, nelat: b.nelat, swlon: b.swlon, swlat: b.swlat, clustered: true, from: $scope.from.toDateString(), to: $scope.to.toDateString()},
              function(response) {
                $log.info("Location query response "+ response.length);
                $scope.locations = response;
                checkLocationRequests();
              },
              function(response) {
                $log.error("Failed to load clustered locations");
                checkLocationRequests();
              })
          }
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


  $scope.$watch(function() {return [State.getToDate(),State.getFromDate()] },
    function(oldval,newval) {
      if (oldval != newval) {
        getLocations();
      }
      else
      {
        $log.warn("Old Dates and New Dates are the same");
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
        State.setToDate(date)
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
        State.setFromDate(date);
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
