'use strict';

angular.module('CACMobile')
  .controller('ObservationCtrl', function ($scope, ResourceFactory, location, $resource) {


   //! Position
   /*
   function getPosition () {
      location.getPosition().then(
         function (position){
            $scope.obs.latitude = position.coords.latitude;
            $scope.obs.longitude = position.coords.longitude;
            });
   }

   getPosition();
   //! End Position */


  var fail = function (content) { alert("save failed", content); } //! \todo something useful
  var success = function (content) {alert("save suceeded", content);} //! \todo something useful


  //! Session {
  $scope.session ={email:null, password:null, token:null};
  $scope.saveSession = function() {
    var sessionResource = ResourceFactory.session();
    sessionResource.create($scope.session,
    function(response){
      $scope.session.token = response.token;
    },
    function(response){
      alert(response.data.error[0]);
    }); //! params, data, success, fail
  }
  //! } End Session

  //! Observation {
  $scope.obs = {id:null,token:null, visibility:"public", recorded_at: new Date().toString()};

  $scope.saveObs = function(token) {

    $scope.obs.token = token;

    var obsResource = ResourceFactory.observation();
    obsResource.create($scope.obs,
    function(response)
    {
      $scope.obs.id = response.id;
    },
    function(response){
      alert(response.data.error[0]);
    }); //! params, data, success, fail
  };
  //! } End Observation


  //! Photo {
  $scope.photo = {token:null, observation_id:null, comment:null, image:null, photo_id:null};
  $scope.savePhoto = function(token, obs_id) {

    $scope.photo.observation_id = obs_id;
    $scope.photo.token = token;

    var photoResource = ResourceFactory.photo();
    photoResource.create($scope.photo,
    function(response){
      $scope.photo_id = response.id;
    },
    function(response){
       alert(response.data.error[0]);
    });
  }
  //! }

  /*
  //$scope.saveObs = function() {
    var obs = new $resource('http://obsnet.herokuapp.com/observation', {},{ test: { method: 'GET' }});
    obs.token = $scope.obs.token;
    obs.recorded_at = $scope.obs.recorded_at;
    obs.visibility = $scope.visibility;
    obs.save(uploadComplete);
   //uploadService.send($scope.obs,$scope)
  //};
*/
  // $scope.latitude = 50.9831700;
  // $scope.longitude = -118.2023000;


/*   var uploadComplete = function (content) {
      //! \todo ensure json parse success before setting response object
      $scope.response = JSON.parse(content); // Presumed content is a json string!
  };*/

  });
