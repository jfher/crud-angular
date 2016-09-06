// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db=null;
var app = angular.module('starter', ['ionic','ngCordova']);

app.run(function($ionicPlatform,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    db=window.openDatabase("sqlite","1.0","sqlitedemo",2000);
    $cordovaSQLite.execute(db,"CREATE TABLE example(id integer primary key,firstname text, lastname text)");

  });
})

app.controller('infoCtrl',function($scope,$cordovaSQLite,$ionicPlatform,$ionicPopup){
  $scope.alldata=[];
 $scope.addInfo=function(){
  var query ="INSERT INTO example(firstname,lastname) VALUES (?,?)";
  $cordovaSQLite.execute(db,query,[$scope.firstname,$scope.lastname]);
 }

 $ionicPlatform.ready(function(){

  $cordovaSQLite.execute(db,"SELECT * FROM example").then(function(result){
    if(result.rows.length){
      for(var i=0; i < result.rows.length; i++){
        $scope.alldata.push(result.rows.item(i));
      }
    }else{
      console.log("No data found");
    }
  },function(error){
    console.log("error"+err);
  });

 });

 $scope.load=function(){
  
  $cordovaSQLite.execute(db,"SELECT * FROM example").then(function(result){
    if(result.rows.length){
      for(var i=0; i < result.rows.length; i++){
        $scope.alldata.push(result.rows.item(i));
      }
    }else{
      console.log("No data found");
    }
  },function(error){
    console.log("error"+err);
  });
 }

 $scope.delete = function(item) {
    var query = "DELETE FROM example where id = ?";
    $cordovaSQLite.execute(db, query, [item.id]).then(function(res) {
        $scope.items.splice($scope.items.indexOf(item), 1);
    }, function (err) {
        console.error(err);
    });
 }

 $scope.edit = function(item){
  $state.go('app.editUnsolvedProblem');
 }

$scope.showConfirm = function(item) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Delete Unsolved Problem',
     template: 'Are you sure you want to delete this unsolved problem?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $scope.delete(item);
     } else {
       console.log('You are not sure');
     }
   });
 };
})
