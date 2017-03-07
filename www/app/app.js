'use strict';
var app = angular.module('MikuduBloodApp', ['ngRoute', 'ngAnimate', 'toaster','checklist-model','angularMoment','infinite-scroll']);
app.config(function ($httpProvider,$compileProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|geo|sms):/);
    
});
app.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/index', {
            title: 'mikudu',
            templateUrl: 'partials/index.html',
            controller: 'authCtrl'
        })
		.when('/login', {
            title: 'Login',
            templateUrl: 'partials/login.html',
            controller: 'authCtrl'
        })
		.when('/privacy', {
            title: 'Privacy',
            templateUrl: 'partials/privacy.html',
            controller: 'privacyCtrl'
        }).when('/forgotpassword', {
                title: 'Forgot Password',
                templateUrl: 'partials/forgotpassword.html',
                controller: 'passwordCtrl'
            })
            .when('/help', {
                title: 'help',
                templateUrl: 'partials/help.html',
                controller: 'helpCtrl'				
            })
            .when('/faq', {
                title: 'How It Works',
                templateUrl: 'partials/faq.html',
                controller: 'faqCtrl'				
            })			
            .when('/logout', {
                title: 'Logout',
                templateUrl: 'partials/login.html',
                controller: 'logoutCtrl'
            })

            .when('/signup', {
                title: 'Signup',
                templateUrl: 'partials/signup.html',
                controller: 'authCtrl'
            })
            .when('/dashboard', {
                title: 'Dashboard',
                templateUrl: 'partials/dashboard.html',
                controller: 'dashboardCtrl',
                resolve: {
                  availability: function(Data, $route,$rootScope){
                    var customerID = $rootScope.uid;
                    return Data.get('getavailability?customer='+customerID);
                  }                  
                }                 
            })
            .when('/profile/:customerID', {
                title: 'Profile',
                templateUrl: 'partials/profile.html',
                controller: 'editCtrl',
                resolve: {
                  customer: function(Data, $route){
                    var customerID = $route.current.params.customerID;
                    return Data.get('profile?customer='+customerID);
                  },
                  country: function(Data, $route){                    
                    return Data.getCountries();
                  }                  
                }                
            })
            .when('/request/:customerID', {
                title: 'Request',
                templateUrl: 'partials/request.html',
                controller: 'requestCtrl',
                resolve: {
                  customer: function(Data, $route){
                    var customerID = $route.current.params.customerID;
                    return Data.get('profile?customer='+customerID);
                  },
                  country: function(Data, $route){                    
                    return Data.getCountries();
                  }                  
                }                
            })
            .when('/notifications/:customerID', {
                title: 'Notifications',
                templateUrl: 'partials/notifications.html',
                controller: 'notificationsCtrl',
                resolve: {
                  customer: function(Data, $route){
                    var customerID = $route.current.params.customerID;
                    return Data.get('profile?customer='+customerID);
                  }                
                }                
            })
            .when('/changepassword', {
                title: 'changepassword',
                templateUrl: 'partials/changepassword.html',
                controller: 'passwordCtrl',                
            })
            .when('/deleteme', {
                title: 'Delete',                
                controller: 'deleteCtrl',
				templateUrl: 'partials/deleteme.html',	
            })
            .when('/viewrequest/:requestID', {
                title: 'viewrequest',
                templateUrl: 'partials/viewrequest.html',
                controller: 'viewRequestCtrl',
                resolve: {
                  request: function(Data, $route){
                    var requestID = $route.current.params.requestID;
                    return Data.get('viewrequest?request='+requestID);
                  }                
                }                                 
            })            
            .when('/myrequests', {
                title: 'My Requests',
                templateUrl: 'partials/myrequests.html',
                controller: 'requestsCtrl',                
            })
            .when('/maps', {
                title: 'Blood Banks',
                templateUrl: 'partials/maps.html',
                controller: 'mapCtrl',
                resolve: {
                  country: function(Data, $route){                    
                    return Data.getCountries();
                  }                  
                }                 
            })               
            .when('/logout', {
                title: 'Login',
                templateUrl: 'partials/login.html',
                controller: 'authCtrl',
                resolve: {
                    logout: function(Data, $route){
                        var storage = window.localStorage;
                        storage.removeItem('uid');
                        storage.removeItem('name');
                        storage.removeItem('email');
                        storage.removeItem('district');                        
                    }                     
                }                                 
            })                                                           
            .when('/', {
                title: 'Dashboard',
                templateUrl: 'partials/dashboard.html',
                controller: 'dashboardCtrl',
                role: '0',
                resolve: {
                  availability: function(Data, $route,$rootScope){
                    var customerID = $rootScope.uid;
                    return Data.get('getavailability?customer='+customerID);
                  }                  
                } 
                
            })
            .otherwise({
                redirectTo: '/index'
            });
  }])
    .run(function ($rootScope, $location, Data) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.authenticated = true;
            var storage = window.localStorage; 

            if(storage.getItem('uid'))
            {
					$rootScope.uid = storage.getItem('uid');
					$rootScope.name = storage.getItem('name');
					$rootScope.email = storage.getItem('email');
					$rootScope.district = storage.getItem('district');
					$rootScope.updatestatus = storage.getItem('updatestatus');
					Data.get('notificationcount?customer='+$rootScope.uid).then(function (results) {
							//$rootScope.notifications = storage.getItem('notifications');
							if(results.status=='success')
							{
								$rootScope.notifications = results.notifications;    
							}
							else                        
							{
								Data.toast(results);   
								$location.path("/logout");
							}
												 
					});						
            }
			else
            {
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login' || nextUrl == '/privacy' || nextUrl == '/forgotpassword' || nextUrl =='/help'|| nextUrl =='/index') {

                    } else {
                        $location.path("/index");
                    }                
            }          

        });
    });
        