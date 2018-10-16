/*
    chirpApp.js
    This file is our main way of adding JavaScript and AngularJS functionality
    to the entire system. It includes all of the AngularJS module dependencies that
    we have used. This file is added to the system by linking it in the index.html 
    file as a JavaScript script.
*/
var app = angular.module('chirpApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngAnimate', 'ui.bootstrap', 'angular-scroll-animate']).run(function($rootScope, $http, $location, $cookies)
{

    if ($cookies.get('userCookie') != null)
    {
        $rootScope.authenticated = true;
        $rootScope.current_user = $cookies.get('userCookie');
        $rootScope.password = $cookies.get('passCookie');

        $rootScope.user = {
            username: $rootScope.current_user,
            password: $rootScope.password
        };

        $http.post('/auth/login', $rootScope.user)
            .success(function(data)
            {
                if (data.user.username != "")
                {
                    $rootScope.authenticated = true;
                    $rootScope.current_user = data.user.username;
                    $rootScope.email = data.user.email;
                    $rootScope.desired_location = data.user.desired_location;
                    $rootScope.date_of_birth = data.user.date_of_birth;
                    $rootScope.role = data.user.role;
                    $rootScope._id = data.user._id;
                    $rootScope.is_staff = data.user.is_staff;
                    $rootScope.filename = data.user.filename;
                    $rootScope.file_ID = data.user.file_ID;
                    $rootScope.progress = data.user.stage;

                    var value = $rootScope.progress; //affects progress bar
                    $rootScope.dynamic = value;
                }
                if ($rootScope.is_staff)
                {
                    $location.path('/ismDashboard');

                    $rootScope.alerts = [
                        {
                            type: 'info',
                            msg: 'Manage your applicants here'
                        }, //affects alert message box

                    ];
                }
                
            });
    }

    $rootScope.logout = function()
    {
        $http.get('/auth/signout');
        $cookies.remove("userCookie");
        $cookies.remove("passCookie");
        $rootScope.authenticated = false;
        $rootScope.current_user = "";
    };
    $rootScope.$on('$routeChangeStart', function(event, next, current)
    {
        if ($location.path() == '/login' || $location.path() == '/ismDashboard' || $location.path() == '/register' || $location.path() == '/logout' || $location.path() == '/complete')
        {
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

/*
    Reroutes the page to the appropriate URL.
*/
app.config(function($routeProvider)
{
    $routeProvider
        //the timeline display
        .when('/',
        {
            templateUrl: 'main.html',
            controller: 'mainController'
        })
        .when('/complete',
        {
            templateUrl: 'completedApplication.html',
            controller: 'completeController'
        })
        //the login display
        .when('/login',
        {
            templateUrl: 'login.html',
            controller: 'authController'
        })
        //the signup display
        .when('/register',
        {
            templateUrl: 'register.html',
            controller: 'authController'
        })
        //the logout display
        .when('/logout',
        {
            templateUrl: 'logout.html',
            controller: 'chirpApp'
        })
        //the video Interview display
        .when('/videoInterview',
        {
            templateUrl: 'videoInterview.html',
            controller: 'videoController'
        })
        //the user Profile display
        .when('/userProfile',
        {
            templateUrl: 'personalInformation.html',
            controller: 'authController'
        })
        //the mail page display
        .when('/mailgunner',
        {
            templateUrl: 'mailGunner.html',
            controller: 'mailController'
        })
        //the Internal Staff Member Dashboard
        .when('/ismDashboard',
        {
            templateUrl: 'InternalStaffDashboard.html',
            controller: 'ismController'
        })
        //the CV display
        .when('/upload',
        {
            templateUrl: 'cvupload.html',
            controller: 'fileController'
        });
});

app.factory('postService', function($resource)
{
    return $resource('/api/posts/:id');
});

app.factory('accountService', function($resource)
{
    return $resource('/api/accounts/:username');
});

app.controller('ismController', function($rootScope, $scope, accountService, $cookies, $http)
{
    if ($cookies.get('filePersist'))
    {
        $scope.user.filename = $cookies.get('filePersist');

        var apiPoint = 'api/updateinfo/' + $cookies.get('tempID');
        $http.put(apiPoint, $scope.user).success(function(data)
        {
            alert("File persistance API call successful.");
        });
        $cookies.remove("filePersist");
        $cookies.remove("tempID");
    }

    /* This function is called when internal staff clicks archive button for the selected applicant.
        It requests the staff to add the notes as a reason for archieving the applicant.
    */
    $scope.reject = function(note)
    {
        // Utilise the Selected User Variables to pass the user through database
    }

    /* This function is called when internal staff clicks progress and presses confirm button for the selected applicant.
        It stages the applicant to next stage and cause an automated email to be sent out to the applicant.
        This extra button is used to make sure the internal staff wants to stage the application to next stage.
    */
    $scope.approve = function(val)
    {
        // Utilise the Selected User Variables to pass the user through database
    }

    $scope.users = accountService.query();

    /* This function is called when staff clicks view applicant button on ISM dashboard.
        It takes 2 argument name- selected applicant name and the associated CV which is stored in filename variable.
        It shows the details of the applicant like what role they applied, what stage they are, if they have uploaded a CV, a button to download & view it,
        a checkbox to set priority of applicant & button to progress/arhieve the applicant.
    */
    $scope.updateUser = function(name, filename) 
    {
        $scope.selectedUser = name;

        document.getElementById('promptDivConfirm').setAttribute("style", "display: none");
        document.getElementById('promptDivArchive').setAttribute("style", "display: none");

        var warningDiv = "<div class=\"alert alert-danger\">Candidate has not uploaded a CV</div>"
        if (filename == null) {
            $scope.selectedFilePath = "\" disabled";
            document.getElementById('warning').innerHTML = warningDiv;
            var buttonDiv = "<a><button class=\"btn btnsecondary\" style=\"width: 40%; margin-left: 30%; margin-right: 30%; vertical-align: bottom\" disabled>Download CV</button></a>"
        } else {
            $scope.selectedFilePath = "upload/files/" + filename;
            var buttonDiv = "<a href=\"" + $scope.selectedFilePath + "\"><button class=\"btn btnsecondary\" style=\"width: 40%; margin-left: 30%; margin-right: 30%; vertical-align: bottom\">Download CV</button></a>"
            document.getElementById('warning').innerHTML = null;
        }
        document.getElementById('cvbutton').innerHTML = buttonDiv;
    }

    /* This function is called when user selects progress or archieve button on applicant's details dailog box.
        It takes val argument to show the div element according to the button selected, if 1, show archive div element
         or show the confirm div element if the staff selects progress button.
    */
    $scope.insertPrompt = function(val)
    {
        if (val == '0') {
            document.getElementById('promptDivConfirm').setAttribute("style", "display: block");
            document.getElementById('promptDivArchive').setAttribute("style", "display: none");
        } else {
            document.getElementById('promptDivConfirm').setAttribute("style", "display: none");
            document.getElementById('promptDivArchive').setAttribute("style", "display: block");
        }
    }

    $scope.clearPrompt = function() 
    {
        document.getElementById('promptDivConfirm').setAttribute("style", "display: none");
        document.getElementById('promptDivArchive').setAttribute("style", "display: none");
    }
});

app.factory('uploadService', function($resource)
{
    return $resource('/upload/:id');
});

//Mail functionality showcase
app.controller('mailController', function($scope, $cookies, $http)
{
    $scope.mail = function()
    {
        $http.get('/mailgun');
    }
});

app.controller('mainController', function($rootScope, $scope, postService)
{
    $scope.posts = postService.query();
    $scope.newPost = {
        created_by: '',
        text: '',
        created_at: ''
    };

    $scope.post = function()
    {
        $scope.newPost.created_by = $rootScope.current_user;
        $scope.newPost.created_at = Date.now();
        postService.save($scope.newPost, function()
        {
            $scope.posts = postService.query();
            $scope.newPost = {
                created_by: '',
                text: '',
                created_at: ''
            };
        });
    };
});

app.controller('authController', function($scope, $rootScope, $http, $location, $cookies)
{
    $rootScope.progress = 2;

    $scope.user = {
        username: '',
        password: ''
    };

    $scope.login = function()
    {
        $http.post('/auth/login', $scope.user)
            .success(function(data)
            {
                try
                {
                    if (data.user.username != "")
                    {
                        $rootScope.authenticated = true;
                        $rootScope.current_user = data.user.username;
                        $rootScope.email = data.user.email;
                        $rootScope.desired_location = data.user.desired_location;
                        $rootScope.date_of_birth = data.user.date_of_birth;
                        $rootScope.role = data.user.role;
                        $rootScope._id = data.user._id; // Fixed
                        $rootScope.progress = data.user.stage;
                        $rootScope.is_staff = data.user.is_staff;
                        $cookies.put('fileID', data.user.file_ID);
                        $rootScope.progress = data.user.stage;

                        $cookies.put('userCookie', $rootScope.current_user);
                        $cookies.put('passCookie', $scope.user.password);

                        if ($rootScope.is_staff)
                        {
                            $location.path('/ismDashboard');
                        }

                        else if ($rootScope.progress === 2)
                        {
                            $location.path('/userProfile');

                            $rootScope.alerts = [
                                {
                                    type: 'info',
                                    msg: 'To finalize your information component, please upload your CV'
                                }, //affects alert message box

                            ];
                        }
                        else if ($rootScope.progress === 3)
                        {
                            $location.path('/userProfile');
                        }
                        else if ($rootScope.progress == 4)
                        {
                            $location.path('/logout');

                            $rootScope.alerts = [
                            {
                                type: 'info',
                                msg: 'Progress'
                            }, //affects alert message box

                        ];
                    }

                        var value = $rootScope.progress;
                        $rootScope.dynamic = value;
                    }
                }
                catch (err)
                {
                    alert("Incorrect login details, Please try again");
                }
            });
    };

    $scope.register = function()
    {
        $http.post('/auth/signup', $scope.user).success(function(data)
        {
            try
            {
                if (data.user.username != "")
                {
                    $rootScope.authenticated = true;
                    $rootScope.current_user = data.user.username;
                    $rootScope.email = data.user.email;
                    $rootScope.desired_location = data.user.desired_location;
                    $rootScope.date_of_birth = data.user.date_of_birth;
                    $rootScope.role = data.user.role;
                    $rootScope._id = data.user._id; // Fixed
                    $rootScope.progress = data.user.stage;
                    $rootScope.is_staff = data.user.is_staff;

                    $cookies.put('userCookie', $rootScope.current_user);
                    $cookies.put('passCookie', $scope.user.password);

                    if ($rootScope.is_staff)
                    {
                        $location.path('/ismDashboard');
                    }

                    $location.path('/');

                    $location.path('/userProfile');

                    $rootScope.alerts = [
                        {
                            type: 'info',
                            msg: 'Hello! Please fill out the information below'
                        }, //affects alert message box
                    ];

                    var value = $rootScope.progress;
                    $rootScope.dynamic = value;
                }
            }
            catch (err)
            {
                alert("Can't sign up this account, please use a different username and fill in all required details");
            }
        });
    };

    $scope.updateInformation = function(val, val2, val3, val4)
    {

        var apiPoint = 'api/updateinfo/' + $rootScope._id;

        $scope.user.email = val;
        $scope.user.desired_location = val2;
        $scope.user.date_of_birth = val3;
        $scope.user.role = val4;
        $scope.user.stage = 3;

        $http.put(apiPoint, $scope.user).success(function(data)
        {
            try
            {
                $location.path('/upload');

                $rootScope.alerts = [
                    {
                        type: 'info',
                        msg: 'Hello! Please fill out the information below'
                    }, //affects alert message box

                ];
            }
            catch (err)
            {
                alert("Something went wrong with the update request. Contact staff.");
            }
        });
    };
});

/*
    Controller for the UI Bootstrap alerts (which tells the applicant what to
    do next) to appear properly.
*/
app.controller('AlertsController', function($scope, $rootScope)
{
    $rootScope.alerts = [
        {
            type: 'info',
            msg: 'Welcome to Deloitte Firestarter, our Intern and Graduate program for the Consulting service line.' +
                ' Please first read this page to learn more about Deloitte Consulting and then create your Deloitte Careers account to login.'
        },

    ];

    $rootScope.closeAlert = function(index)
    {
        $rootScope.alerts.splice(index, 1);
    };
});

/*
    Controller to control and change the UI Bootstrap progress bar that outlines which
    step the applicant is on.
*/
app.controller('ProgressBarController', function($scope, $rootScope)
{
    $rootScope.max = 5;
    var value = $rootScope.progress;

    $rootScope.dynamic = value;
});

/*
    Controller to control the fade animation when scrolling on the landing page (i.e.
    main.html). First, it defines the functions (which are called when scrolling up or 
    down the page) that removes or adds the fade effect dynamically. Then, it manipulates
    all child elements within the 'MainParent' div to add the appropriate attributes
    necessary for the functionality to occur. These attributes are then recompiled so that
    AngularJS can acknowledge them.
*/
app.controller('ScrollAnimationController', function($scope, $compile, $injector)
{
    $scope.animateElementIn = function($el)
    {
        $el.removeClass('animated fadeOut');
        $el.addClass('animated fadeIn'); //Leverages animate.css classes
    };

    $scope.animateElementOut = function($el)
    {
        $el.addClass('animated fadeOut');
        $el.removeClass('animated fadeIn'); //Leverages animate.css classes
    };

    var addAttributes = angular.element(document.getElementById('MainParent').children);
    
    addAttributes.attr('class',"not-visible");
    addAttributes.attr('when-visible',"animateElementIn");
    addAttributes.attr('when-not-visible',"animateElementOut");
    $scope = addAttributes.scope();
    $injector = addAttributes.injector();
    $injector.invoke(function($compile)
    {
        $compile(addAttributes)($scope)
    })
});

app.controller('fileController', function($rootScope, $scope, uploadService, $cookies, $http)
{
    $scope.user.filename = "sss";

    if ($cookies.get('filePersist'))
    {
        $scope.user.filename = $cookies.get('filePersist');

        var apiPoint = 'api/updateinfo/' + $cookies.get('tempID');
        $http.put(apiPoint, $scope.user).success(function(data){});
        $cookies.remove("filePersist");
        $cookies.remove("tempID");
    }

    $scope.delete = function()
    {
        var id = prompt("Please confirm the ID of the file:", "");
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "http://localhost:3000/upload/files/" + id, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
    }

    $scope.associate = function()
    {
        var fullPath = document.getElementById('file').value;
        if (fullPath)
        {
            try
            {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                var filename = fullPath.substring(startIndex);
                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0)
                {
                    filename = filename.substring(1);
                }
            }
            catch
            {
                alert("difficult");
            }
            $cookies.put('tempID', $rootScope._id);
            $cookies.put('filePersist', filename);
        }
    }

    $scope.files = uploadService.query();

});

app.controller('videoController', function($rootScope, $scope, $cookies, $http)
{

    $rootScope.progress = 4;

    $scope.completed = function()
    {
        $location.path('/complete');
    }

});

app.controller('completeController', function($rootScope, $scope, $cookies, $http)
{

    $rootScope.progress = 5;

});