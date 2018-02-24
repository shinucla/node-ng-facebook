'use strict';

angular.module('fbn')
  .controller('fbnAuthController', function($rootScope,
					    $scope,
					    $location,
					    FbnAuthService,
					    FbnServerCallService) {

    $scope.login = function(credential) {
      FbnAuthService
        .login(credential)
        .then(function(jwt) {
	  FbnAuthService.saveJWT(jwt, function(err) {
	    alert('Your web browser does not support storing settings locally. '
		  + 'In Safari, the most common cause of  this is using "Private Browsing Mode"');
	  });
	  
	  FbnAuthService.loadUser();
	  $location.path('#/home');

        }, function(errMsg) {
	  FbnAuthService.clearJWT();
          credential.errMessage = errMsg;
        });
    };

    $scope.signup = function(userData) {
      FbnAuthService
        .signup(userData)
        .then(function(jwt) { // defer.resolve
	  FbnAuthService.saveJWT(jwt);
	  FbnAuthService.loadUser();

	  $location.path('#/home');

	}, function(errMsg) { // defer.reject
	  FbnAuthService.clearJWT();
	});
    };


 });

// https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec


