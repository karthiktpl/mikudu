'use strict';
var app = angular.module('MikuduBloodAppMap', ['ngRoute', 'ngAnimate', 'toaster']);
app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
    
});
app.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.                                                                      
            .when('/', {
                title: 'Blood Banks',
                templateUrl: 'partials/maps.html',
                controller: 'mapCtrl',                                
                
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
        });
    });
        