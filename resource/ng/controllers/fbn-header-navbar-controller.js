'use strict';

// To retrieve a reference to the same module for further 
// configuration, call angular.module without the array argument.
angular.module('fbn')
  .controller('fbnHeaderNavbarController', function($scope,
						    $rootScope,
						    AUTH_EVENTS,
						    FbnContextService, 
						    FbnAuthService) {

    $scope.goHome = function() {

    };

    $scope.login = function(username, password) {

    };

    $scope.signup = function(user) {

    };

    $scope.logoff = function() {

    };

 });


// https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
