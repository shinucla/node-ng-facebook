'use strict';

// To retrieve a reference to the same module for further 
// configuration, call angular.module without the array argument.
angular.module('fbn')

  .constant('AUTH_EVENTS', { LOGIN_SUCCESS: 'auth-login-success',
			     LOGINF_AILED: 'auth-login-failed',
			     LOGOUT_SUCCESS: 'auth-logout-success',
			     SESSION_TIMEOUT: 'auth-session-timeout',
			     NOT_AUTHENTICATED: 'auth-not-authenticated',
			     NOT_AUTHORIZED: 'auth-not-authorized'
			   })

  .constant('USER_ROLES', { ALL: '*',
			    ADMIN: 'admin',
			    EDITOR: 'editor',
			    GUEST: 'guest'
			  })

;


