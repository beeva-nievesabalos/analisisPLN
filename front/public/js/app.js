'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/demo', {
      templateUrl: 'partials/demo',
      controller: 'DemoCtrl'
    }).
    otherwise({
      redirectTo: '/demo'
    });

  $locationProvider.html5Mode(true);
});
