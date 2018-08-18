//chirpApp.js
var app = angular.module('chirpApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngAnimate', 'ui.bootstrap', 'angular-scroll-animate']).run(function($rootScope, $http, $location, $cookies){
  $rootScope.authenticated = false;
  $rootScope.current_user = "";

  $rootScope.logout = function(){
    $http.get('/auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = "";
  };

  $rootScope.$on('$routeChangeStart', function(event, next, current){
    if ($location.path() == '/login' || $location.path() == '/register') {
      $rootScope.hidealert = true;
      $rootScope.hideprog = true;
    }
    else
    {
      $rootScope.hidealert = false;
      $rootScope.hideprog = false;
    };
  });
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
    });
});

app.factory('postService', function($resource){
  return $resource('/api/posts/:id');
});

app.factory('uploadService', function($resource){

  return $resource('/upload/:id');
});

//Cookie functionality showcase
app.controller('cookieBaker', function($scope, $cookies){
  $cookies.put('userCookie', 'set');
  $cookies.put('authCookie', 'set');

  $scope.myCookieVal = $cookies.get('cookie');
  $scope.myUserCookie = $cookies.get('userCookie');
  $scope.myAuthCookie = $cookies.get('authCookie');

  $scope.setCookie = function(val) {
      $cookies.put('cookie', val);
  }
});

app.controller('fileController', function($scope, $cookies){
  $cookies.put('cookie', 'logout cookie');
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

app.controller('authController', function($scope, $rootScope, $http, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.user.username != ""){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;

        $location.path('/');

        $rootScope.alerts = [
          { type: 'info', msg: 'Hello! Please fill out the information below' }, //affects alert message box
      
        ];

        var value = 2; //affects progress bar
        $rootScope.dynamic = value;
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
});

app.controller('AlertsController', function($scope, $rootScope){
  $rootScope.alerts = [
    { type: 'info', msg: 'Welcome to Deloitte Firestarter, our Intern and Graduate program for the Consulting service line.' +
    ' Please first read this page to learn more about Deloitte Consulting and then create your Deloitte Careers account to login.' },

  ];

  $rootScope.closeAlert = function(index) {
    $rootScope.alerts.splice(index, 1);
  };
});

app.controller('ProgressBarController', function($scope, $rootScope){
  $rootScope.max = 5;
  var value = 1;

  $rootScope.dynamic = value;
});


app.controller('ScrollAnimationController', function($scope) {
 
  $scope.animateElementIn = function($el) {
    $el.removeClass('animated fadeOut');
    $el.addClass('animated fadeIn'); //Leverages animate.css classes
  };
   
  $scope.animateElementOut = function($el) {
    $el.addClass('animated fadeOut');
    $el.removeClass('animated fadeIn'); //Leverages animate.css classes
  };
});