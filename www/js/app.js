// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db=null;
var app = angular.module('starter', ['ionic','ngCordova']);

app.run(function($ionicPlatform,$cordovaSQLite,$state) {
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


app.controller('AddCtrl', function($scope, $cordovaSQLite, $state){
    $scope.item = {
      firstname: "",
      lastname: ""
    };

    $scope.save = function(item){
      var query ="INSERT INTO example(firstname,lastname) VALUES (?,?)";
      $cordovaSQLite.execute(db,query,[$scope.item.firstname,$scope.item.lastname]);
      $state.go('unsolved');
    };
});

app.controller('ShowCtrl', function($scope, $cordovaSQLite, $state,$ionicPlatform){
  $scope.alldata=[];

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
});

app.controller('DeleteCtrl', function($scope, $cordovaSQLite, $state, $ionicPopup){

  $scope.delete = function(item) {
    var query = "DELETE FROM example where id = ?";
    $cordovaSQLite.execute(db, query, [item.id]).then(function(res) {
        $scope.items.splice($scope.items.indexOf(item), 1);
    }, function (err) {
        console.error(err);
    });
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
});

app.controller('EditCtrl', function($scope, $cordovaSQLite, $state){
  $scope.item = {
      firstname: "",
      lastname: "",
      id:$state.params.itemId
    };


  $scope.find = function(item) {
    var query ="SELECT * FROM example where id = ?";
    $cordovaSQLite.execute(db,query,[$scope.item.id]).then(function(result){
    $scope.itemf = result.rows.item(0);
    $scope.item.firstname = $scope.itemf.firstname;
    $scope.item.lastname = $scope.itemf.lastname;
    $scope.firstname = $scope.item.firstname;
  });
  };

  $scope.save = function(item){
      $scope.find(item);
      var query ="UPDATE example SET firstname = ? ,lastname = ? where id = ?";
      $cordovaSQLite.execute(db,query,[$scope.item.firstname,$scope.item.lastname,$scope.item.id]);
      $state.go('unsolved');
  };
});


app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider.state('unsolved', {
      url: '/unsolved',
      templateUrl: 'templates/unsolved.html',
      controller: 'ShowCtrl'
    });

    $stateProvider.state('add', {
      url: '/add',
      templateUrl: 'templates/new_unsolved.html',
      controller: 'AddCtrl'
    });

    $stateProvider.state('edit', {
      url: '/edit/:itemId',
      templateUrl: 'templates/edit_unsolved.html',
      controller: 'EditCtrl'
    });


    $urlRouterProvider.otherwise('/unsolved');

  });