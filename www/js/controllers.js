angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    $scope.fbApp = fbApp;
    $scope.fbApp.database().ref('room').on('value', function(snapshot){
        $scope.rooms = snapshot.val();
        console.log($scope.rooms);
    });

});
