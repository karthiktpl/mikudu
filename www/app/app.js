'use strict';
var app = angular.module('MikuduBloodApp', ['ngRoute', 'ngAnimate', 'toaster']);
app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
    
});
app.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/login', {
            title: 'Login',
            templateUrl: 'partials/login.html',
            controller: 'authCtrl'
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
            .when('/viewrequest/:requestID', {
                title: 'changepassword',
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
                redirectTo: '/login'
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
            }
            else
            {
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login') {

                    } else {
                        $location.path("/login");
                    }                
            }          
            /*Data.get('session').then(function (results) {
                if (results.uid) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;
                    $rootScope.district = results.district;
                    $rootScope.notifications = results.notifications;                     
                } else {
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login') {

                    } else {
                        $location.path("/login");
                    }
                }
            });*/
        });
    });
        