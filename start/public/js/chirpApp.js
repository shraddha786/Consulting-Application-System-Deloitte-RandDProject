// ChirpApp.js
//chirpApp.js
var app = angular.module('chirpApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngAnimate', 'ui.bootstrap', 'angular-scroll-animate', 'ngIdle']).run(function ($rootScope, $http, $location, $cookies) {

  if($cookies.get('userCookie') != null){
    $rootScope.authenticated = true;
    $rootScope.current_user = $cookies.get('userCookie');
    $rootScope.password = $cookies.get('passCookie');

    $rootScope.user = { username: $rootScope.current_user, password: $rootScope.password };

    $http.post('/auth/login', $rootScope.user)
      .success(function (data) {
          if (data.user.username != "") {
            $rootScope.authenticated = true;
            $rootScope.current_user = data.user.username;
            $rootScope.email = data.user.email;
            $rootScope.desired_location = data.user.desired_location;
            $rootScope.date_of_birth = data.user.date_of_birth;
            $rootScope.role = data.user.role;
            $rootScope._id = data.user._id;
            $rootScope.progress = data.user.stage;
            $rootScope.is_staff = data.user.is_staff;
            $rootScope.filename = data.user.filename;

            var value = $rootScope.progress; //affects progress bar
            $rootScope.dynamic = value;
          }
          if ($rootScope.is_staff){
            $location.path('/ismDashboard');
            
            $rootScope.alerts = [
              { type: 'info', msg: 'Work hard you are being paid by the hour bozzo' }, //affects alert message box
        
            ];
          }else if($rootScope.progress == 2){
            $location.path('/userProfile');

            $rootScope.alerts = [
              { type: 'info', msg: 'Hello! Please fill out the information below' }, //affects alert message box
        
            ];
          }else if($rootScope.progress == 3){
            $location.path('/upload');

            $rootScope.alerts = [
              { type: 'info', msg: 'To finilize your information component, please upload your CV' }, //affects alert message box
        
            ];
          }
      });
  }

  $rootScope.logout = function () {
    $http.get('/auth/signout');
    $cookies.remove("userCookie");
    $cookies.remove("passCookie");
    $rootScope.authenticated = false;
    $rootScope.current_user = "";
  };
  $rootScope.$on('$routeChangeStart', function(event, next, current){
    if ($location.path() == '/login' || $location.path() == '/register' ||  $location.path() == '/logout') {
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
    //the Internal Staff Member Dashboard
    .when('/ismDashboard', {
      templateUrl: 'InternalStaffDashboard.html',
      controller: 'ismController'
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

app.factory('accountService', function($resource) {
  return $resource('/api/accounts/:username');
});

app.controller('ismController', function ($rootScope, $scope, accountService, $cookies, $http) {

  if($cookies.get('filePersist') != null){
    $scope.user.filename = $cookies.get('filePersist');

    var apiPoint = 'api/updateinfo/'+$cookies.get('tempID');
    $http.put(apiPoint, $scope.user).success(function (data) {
      alert("File persistance API call successful.");
    });
    $cookies.remove("filePersist");
    $cookies.remove("tempID");
  }

  $scope.users = accountService.query();

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

  $scope.myCookieVal = $cookies.get('cookie');
  $scope.myUserCookie = $cookies.get('userCookie');

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

app.controller('authController', function ($scope, $rootScope, $http, $location, $cookies) {
  $scope.user = { username: '', password: '' };

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
            $rootScope._id = data.user._id;// Fixed
            $rootScope.progress = data.user.stage;
            $rootScope.is_staff = data.user.is_staff;

            $cookies.put('userCookie', $rootScope.current_user);
            $cookies.put('passCookie', $scope.user.password);

            if ($rootScope.is_staff){
              $location.path('/ismDashboard');
            }

            if($rootScope.progress == 2){
              $location.path('/userProfile');

              $rootScope.alerts = [
                { type: 'info', msg: 'To finilize your information component, please upload your CV' }, //affects alert message box
          
              ];
            }
    
            var value = $rootScope.progress;
            $rootScope.dynamic = value;
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
          $rootScope.email = data.user.email;
          $rootScope.desired_location = data.user.desired_location;
          $rootScope.date_of_birth = data.user.date_of_birth;
          $rootScope.role = data.user.role;
          $rootScope._id = data.user._id;// Fixed
          $rootScope.progress = data.user.stage;
          $rootScope.is_staff = data.user.is_staff;

          $cookies.put('userCookie', $rootScope.current_user);
          $cookies.put('passCookie', $scope.user.password);

          if ($rootScope.is_staff){
            $location.path('/ismDashboard');
          }

          $location.path('/');

          $location.path('/userProfile');

          $rootScope.alerts = [
            { type: 'info', msg: 'Hello! Please fill out the information below' }, //affects alert message box
          ];

          var value = $rootScope.progress;
          $rootScope.dynamic = value;
        }
      } catch (err) {
        alert("Can't sign up this account, please use a different username and fill in all required details");
      }
    });
  };

  $scope.updateInformation = function (val, val2, val3, val4) {

    var apiPoint = 'api/updateinfo/'+$rootScope._id;
    
    $scope.user.email = val;
    $scope.user.desired_location = val2;
    $scope.user.date_of_birth = val3;
    $scope.user.role = val4;
    
    $http.put(apiPoint, $scope.user).success(function (data) {
      try {
          $location.path('/upload');

          $rootScope.alerts = [
            { type: 'info', msg: 'Hello! Please fill out the information below' }, //affects alert message box
        
          ];
      } catch (err) {
        alert("Something went wrong with the update request. Contact staff.");
      }
    });
  };

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
  var value = $rootScope.progress;

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

app.controller('fileController', function ($rootScope, $scope, uploadService, $cookies) {

  $scope.delete = function () {
    var id = prompt("Please confirm the ID of the file:", "");
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/upload/files/" + id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  }

  $scope.associate = function() {
    var fullPath = document.getElementById('file').value;
    if (fullPath) {
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
          filename = filename.substring(1);
      }

      $cookies.put('tempID', $rootScope._id);
      $cookies.put('filePersist', filename);
    }
  }
  
  $scope.files = uploadService.query();
});
