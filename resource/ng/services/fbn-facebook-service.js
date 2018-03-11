'use strict';

// service can be created by provider and factory
// can be used the same way:
// ContextService.set();
// ContextFactoryService.set();
//
// However, all the providers are instantiated before factories
// so you can inject providers into factories, but you cannot
// inject factories into providers.
// 
// BUT, if a provider injected into a service, this service can 
// no longer be able to inject into other services!!!
//

angular.module('fbn')
  .factory('FbnFacebookService', function(FbnServerCallService,
					  $window,
					  $location,
					  $route) {
    var service = {};

    service.authenticateFbAccess = function() {
      FbnServerCallService
	.exec('/oauth/api/getEncryptedUserId')
	.then(function(uid) {
	  return $window.open('/oauth/api/facebook?uid=' + uid,
			      "_blank",
			      "scrollbars=0,resizable=0,width=750,height=550,left=400,top=200");
	})
	.then(function() {
	  $location.path('/');
	});
    };
    
    service.resetFbAccess = function() {
      FbnServerCallService
	.exec('/businessManager/api/revokeAdminUserToken')
	.then(function() {
	  $route.reload(); // reload current page route
	});
    };

    service.getMe = function(callback) {
      FbnServerCallService
	.exec('/businessManager/api/me')
	.then(callback);
    };
    
    return service;
  })

;
