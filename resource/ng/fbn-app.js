'use strict';

angular.module('fbn', ['ngCookies', 'ngRoute', 'ui.bootstrap'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider

      .when('/', { templateUrl: '/ng/views/fbn-home.html' })
      .when('/home', { templateUrl: '/ng/views/fbn-home.html' })

      .when('/login/login', { templateUrl: '/ng/views/fbn-login-login.html', controller: 'fbnAuthController' })
      .when('/login/signup', { templateUrl: '/ng/views/fbn-login-signup.html', controller: 'fbnAuthController' })

      .when('/settings/oauth', { templateUrl: '/ng/views/fbn-settings-oauth.html', controller: 'fbnSettingsController' })
      .when('/businessManager', { templateUrl: '/ng/views/fbn-business-manager.html', controller: 'fbnBusinessManagerController' })
      .when('/page', { templateUrl: '/ng/views/fbn-page.html', controller: 'fbnPageController' })
      .when('/adAccount', { templateUrl: '/ng/views/fbn-ad-account.html', controller: 'fbnAdAccountController' })

      .when('/oauth/api/facebook', { template: '<div>what</div>', controller: 'fbnAuthController'})

      //.when('/product', { template: '<ng-product />' })

      .otherwise({redirectTo: '/'});
  }])

  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$q', '$window','$location', '$rootScope', function($q, $window, $location, $rootScope) {
      
      return {
	'request' : function (config) {
	  config.headers = config.headers || {};
	  config.headers.jwt = $window.localStorage['jwt'] || $rootScope.jwt;

	  if (!config.headers.jwt 
	      && '/login/signup' !== $location.path()
	      && '/login/login' !== $location.path()) {
	    $location.path('/login/login');
	  }

	  return config;
	}
      };

    }]);
  }])

  .run(function($rootScope,
                $window,
                $cookies,      // service in module ngCookies
		$cookieStore,  // service in module ngCookies
		USER_ROLES,
                FbnServerCallService,
		FbnAuthService ) {

    FbnAuthService.loadUser();  // Load the local stored user info
    
    //$rootScope.userRoles = USER_ROLES;
    //$rootScope.isAuthorized = FbnAuthService.isAuthorized;

    /* $cookies vs $cookieStore:
       1) $cookieStore as front end local storage solution
          - reading:
          var resp = $cookieStore.get('my_cookie');

          - storing:
          FbnServerCallService
           .exec('/serverservice/testexec', { data: 'this is the data' })
           .then(function(data) {
             $cookieStore.put('my_cookie', data.text);
           });

       2) $cookies allow access to cookies
         console.log($cookies.get('my_cookie'));
    */

  })
;
