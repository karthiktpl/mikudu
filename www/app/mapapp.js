'use strict';
var app = angular.module('MikuduBloodAppMap', ['ngRoute', 'ngAnimate', 'toaster']);
app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
    
});

        