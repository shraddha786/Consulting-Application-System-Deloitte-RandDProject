//chirpApp.js
var app = angular.module('chirpApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngAnimate', 'ui.bootstrap', 'ngIdle']).run(function ($rootScope, $http, $location, $cookies) {
  $rootScope.authenticated = false;
  $rootScope.current_user = "";

  $rootScope.logout = function () {
    $http.get('/auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = "";
  };
});

app.config(function ($routeProvider) {
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
      controller: 'authController'
    })
    //the mail page display
    .when('/mailgunner', {
      templateUrl: 'mailGunner.html',
      controller: 'mailController'
    })
    //the CV display
    .when('/upload', {
      templateUrl: 'cvupload.html',
      controller: 'fileController'
    });
},['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
  IdleProvider.idle(5);
  IdleProvider.timeout(5);
  KeepaliveProvider.interval(10);
}]);

app.factory('postService', function ($resource) {
  return $resource('/api/posts/:id');
});

app.factory('uploadService', function ($resource) {

  return $resource('/upload/:id');
});

//Mail functionality showcase
app.controller('mailController', function ($scope, $cookies, $http) {
  $scope.mail = function () {
    $http.get('/mailgun');
  }
});

//Cookie functionality showcase
app.controller('cookieBaker', function ($scope, $cookies, Idle, Keepalive, $uibModal) {
  $cookies.put('userCookie', 'set');
  $cookies.put('authCookie', 'set');

  $scope.myCookieVal = $cookies.get('cookie');
  $scope.myUserCookie = $cookies.get('userCookie');
  $scope.myAuthCookie = $cookies.get('authCookie');

  $scope.setCookie = function (val) {
    $cookies.put('cookie', val);
  }

  $scope.started = false;

      function closeModals() {
        if ($scope.warning) {
          $scope.warning.close();
          $scope.warning = null;
        }

        if ($scope.timedout) {
          $scope.timedout.close();
          $scope.timedout = null;
        }
      }

      $scope.$on('IdleStart', function() {
        closeModals();

        $scope.warning = $uibModal.open({
          templateUrl: 'warning-dialog.html',
          windowClass: 'modal-danger'
        });
      });

      $scope.$on('IdleEnd', function() {
        closeModals();
      });

      $scope.$on('IdleTimeout', function() {
        closeModals();
        $scope.timedout = $uibModal.open({
          templateUrl: 'timedout-dialog.html',
          windowClass: 'modal-danger'
        });
      });

      $scope.start = function() {
        closeModals();
        Idle.watch();
        $scope.started = true;
      };

      $scope.stop = function() {
        closeModals();
        Idle.unwatch();
        $scope.started = false;

      };

}).config(function(IdleProvider, KeepaliveProvider) {
  IdleProvider.idle(5);
  IdleProvider.timeout(5);
  KeepaliveProvider.interval(10);
});

app.controller('fileController', function ($scope, $cookies) {
  $cookies.put('cookie', 'logout cookie');
});

app.controller('mainController', function ($rootScope, $scope, postService) {
  $scope.posts = postService.query();
  $scope.newPost = { created_by: '', text: '', created_at: '' };

  $scope.post = function () {
    $scope.newPost.created_by = $rootScope.current_user;
    $scope.newPost.created_at = Date.now();
    postService.save($scope.newPost, function () {
      $scope.posts = postService.query();
      $scope.newPost = { created_by: '', text: '', created_at: '' };
    });
  };
});

app.controller('authController', function ($scope, $rootScope, $http, $location) {
  $scope.user = { username: '', password: '' };
  $scope.error_message = '';

  $scope.login = function () {
    $http.post('/auth/login', $scope.user)
      .success(function (data) {
        try {
          if (data.user.username != "") {
            $rootScope.authenticated = true;
            $rootScope.current_user = data.user.username;
            $rootScope.email = data.user.email;
            $rootScope.desired_location = data.user.desired_location;
            $rootScope.date_of_birth = data.user.date_of_birth;
            $rootScope.role = data.user.role;

            $location.path('/');
          }
        }
        catch (err) {
          alert("Incorrect login details, Please try again");
        }
      });
  };

  $scope.register = function () {
    $http.post('/auth/signup', $scope.user).success(function (data) {
      try {
        if (data.user.username != "") {
          $rootScope.authenticated = true;
          $rootScope.current_user = data.user.username;

          $location.path('/');
        }
      } catch (err) {
        alert("Can't sign up this account, please use a different username and fill in all required details");
      }
    });
  };
});

app.controller('fileController', function ($rootScope, $scope, uploadService) {
  $scope.delete = function () {
    var id = prompt("Please confirm the ID of the file:", "");
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/upload/files/" + id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  }

  $scope.files = uploadService.query();
});

app.controller('AlertsController', function ($scope) {
  $scope.alerts = [
    { type: 'info', msg: 'Welcome to Deloitte Firestarter, our Intern and Graduate program for the Consulting service line' },

  ];

  $scope.closeAlert = function (index) {
    $scope.alerts.splice(index, 1);
  };
});
