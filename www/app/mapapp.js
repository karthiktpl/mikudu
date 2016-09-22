'use strict';
var app = angular.module('MikuduBloodAppMap', ['ngRoute', 'ngAnimate', 'toaster']);
app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
    
}).run(function ($rootScope, $location, Data) {
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
    });;

        