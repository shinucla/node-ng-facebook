'use strict';

// To retrieve a reference to the same module for further
// configuration, call angular.module without the array argument.
angular.module('fbn')

  .factory('FbnAuthService', function($rootScope,
                                      $http,
                                      $q,
                                      $cookieStore,
                                      $window,
                                      $location,
				      FbnServerCallService ) {
    var authService = {};

    authService.login = function(credential) {
      var defer = $q.defer();

      FbnServerCallService
        .exec('/login/api/login', credential)
        .then(function(result) {
          if (!!result && !!result.jwt) {
            defer.resolve(result.jwt);

          } else {
            defer.reject((!!result && !!result.errMsg
                          ? result.errMsg
                          : 'cannot login, please try again later'));
          }
        });

      return defer.promise;
    };

    authService.signup = function(profile) {
      var defer = $q.defer();

      FbnServerCallService
        .exec('/login/api/signup', profile)
        .then(function(result) {
          if (!!result && !!result.jwt) {
            defer.resolve(result.jwt);

          } else {
            defer.reject((!!result && !!result.errMsg
                          ? result.errMsg
                          : 'cannot login, please try again later'));
          }
        });

      return defer.promise;
    };

    authService.logout = function() {
      delete $window.localStorage['jwt'];
      delete $rootScope.user;
      $cookieStore.remove('user');
    };

    authService.saveJWT = function(jwt, callback) {
      $rootScope.jwt = jwt;

      try {
        $window.localStorage['jwt'] = jwt;
      } catch(e) {
        callback(e);
      }
    };

    authService.clearJWT = function() {
      delete $window.localStorage['jwt'];
    };

    authService.getJWT = function() {
      return $window.localStorage['jwt'] || $rootScope.jwt;
    };

    authService.loadUser = function() {
      loadUserProfile();
      //loadUserExtension();
    };

    // ----------------------------------------------------------------
    
    function loadUserProfile() {
      try {
        var jwt = $window.localStorage['jwt'] || $rootScope.jwt;
	
        if (!!jwt && 0 < jwt.indexOf('.')) {
          var base64Url = jwt.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
	  
          $rootScope.user = JSON.parse($window.atob(base64))._doc;
        }
      } catch (e) {
        try { delete $window.localStorage['jwt']; } catch(e) {}
      }
    }
    
    function loadUserExtension() {
      try {
	if (!$rootScope.user
            || (!forcedToLoad
		&& $rootScope.userExtension
		&& $rootScope.userExtension.userId
		&& $rootScope.userExtension.userId.toString() === $rootScope.user._id.toString())) {
          console.log('cached');
          return;
	}
	
	FbnServerCallService
          .get('/login/api/extension')
          .then(function(extension) {
            $rootScope.userExtension = extension;
          });
      } catch (e) {
	// nop
      }
    }

    return authService;
  })
;
