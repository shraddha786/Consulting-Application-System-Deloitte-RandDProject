//chirpApp.js
var app = angular.module('chirpApp', ['ngRoute', 'ngResource', 'ngCookies']).run(function($rootScope, $http, $location, $cookies){
  $rootScope.authenticated = false;
  $rootScope.current_user = "";

  $rootScope.logout = function(){
    $http.get('/auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = "";
  };
});

app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
    //the signup display
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'authController'
    })
    //the logout display
    .when('/logout', {
      templateUrl: 'logout.html',
      controller: 'chirpApp'
    })
    //the Cookie showcaser
    .when('/cookieBaker', {
      templateUrl: 'cookieBaker.html',
      controller: 'cookieBaker'
    })
    //the video Interview display
    .when('/videoInterview', {
      templateUrl: 'videoInterview.html',
      controller: 'mainController'
    })
    //the user Profile display
    .when('/userProfile', {
      templateUrl: 'personalInformation.html',
      controller: 'mainController'
    })
    //the CV display
    .when('/upload', {
      templateUrl: 'cvupload.html',
      controller: 'fileController'
    })
    //the MailGun display
    .when('/mailGun', {
      templateUrl: 'mailGunner.html',
      controller: 'mailController'
    });
});

app.factory('postService', function($resource){
  return $resource('/api/posts/:id');
});

app.factory('uploadService', function($resource){

  return $resource('/upload/:id');
});

//Cookie functionality showcase
app.controller('cookieBaker', function($rootScope, $scope, $cookies){

  $cookies.put('userCookie', 'set');
  $cookies.put('authenCookie', 'set');

  $scope.myCookieVal = $cookies.get('cookie');
  $scope.myUserCookie = $cookies.get('userCookie');
  $scope.myAuthCookie = $cookies.get('authCookie');

  $scope.setCookie = function(val) {
      $cookies.put('cookie', val);
  }
});

app.controller('mainController', function($rootScope, $scope, postService){
  $scope.posts = postService.query();
  $scope.newPost = {created_by: '', text: '', created_at: ''};

  $scope.post = function(){
    $scope.newPost.created_by = $rootScope.current_user;
    $scope.newPost.created_at = Date.now();
    postService.save($scope.newPost, function(){
      $scope.posts = postService.query();
      $scope.newPost = {created_by: '', text: '', created_at: ''};
    });
  };
});

app.controller('mailController', function($rootScope, $scope, postService){
  
});

app.controller('authController', function($scope, $rootScope, $http, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.user.username != ""){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;

        $location.path('/');
      }
    });
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;

        $location.path('/');
    });
  };
});

app.controller('fileController', function($rootScope, $scope, uploadService){
   
  $scope.files = uploadService.query();
  
  $scope.delete = function(){
    var id = prompt("Please confirm the ID of the file:", "");
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/upload/files/"+id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

    alert("File has been deleted from the system");
    /** USING SIMILAR TO BYPASS 1.2.0 to 1.4.0 ERROR $http.post('/auth/login', $scope.user).success(function(data){
      if(data.user.username != ""){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;

        $location.path('/');
      }
    });**/
  };
});