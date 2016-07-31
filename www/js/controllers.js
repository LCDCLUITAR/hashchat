angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    $scope.fbApp = fbApp;
    $scope.fbApp.database().ref('room').on('value', function(snapshot){
        $scope.rooms = snapshot.val();
        console.log($scope.rooms);
    });

    $scope.user = $scope.fbApp.auth().currentUser;
    console.log($scope.user);


})
.controller('Register', function($scope, $ionicModal, $timeout) {
    console.log('Register');
    $scope.fbApp = fbApp;
    

    $scope.createUser = function(email, pass, conPass){

        if (pass != conPass){
            alert("Passwords don't match!");
        }
        else{
            $scope.fbApp.auth().createUserWithEmailAndPassword(email, pass).catch(function(error){
                alert(error.code + " - " + error.message);
            });
            window.location.replace('#/login');
        }
    }

})
.controller('Login', function($scope, $ionicModal, $timeout) {
    console.log('Login');
    $scope.fbApp = fbApp;
    
    $scope.Login = function(email, pass){
        $scope.fbApp.auth().signInWithEmailAndPassword(email, pass).catch(function(error){
            alert(error.code + " - " + error.message);
        });
        $scope.user = $scope.fbApp.auth().currentUser;
        window.location.replace('#/app/home');
    }


})