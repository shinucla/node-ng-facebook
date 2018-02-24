'use strict';

angular.module('fbn')
  .controller('fbnBusinessManagerController', function($scope,
						       $window,
						       $q,
						       $route,
						       $location,
						       $uibModal,
						       $document,
						       $log,
						       FbnContextService,
						       FbnSessionService,
						       FbnServerCallService) {

    $scope.hasAdminUserToken = null;
    FbnServerCallService.exec('/businessManager/api/getHasAdminUserToken').then(function(b) { $scope.hasAdminUserToken = b; });
    FbnServerCallService.exec('/businessManager/api/getLinkedBusinessManagers').then(function(bms) { $scope.bms = bms; });
    
    $scope.authenticateFbAccess = function() {
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

    $scope.resetFbAccess = function() {
      FbnServerCallService
	.exec('/businessManager/api/revokeAdminUserToken')
	.then(function() {
	  $route.reload(); // reload current page route
	});
    };
    


    /* The whole thing can be encapsulated into a service
     *    FbnDialog
     *      .editor({ templateUrl: '',
     *                bindings: { }
     *  
     *
     */
    $scope.linkBusinessManager = function() {
      $uibModal
	.open({ component: 'linkBusinessManagerEditor',
		resolve: { // will be resolved before passing to editor
		  clientBms: FbnServerCallService.exec('/businessManager/api/getClientBusinessManagers'),
		  linkedBms: FbnServerCallService.exec('/businessManager/api/getLinkedBusinessManagers'),
		  hasToken: FbnServerCallService.exec('/businessManager/api/getHasAdminUserToken'),
		  constValue: 12345,
		},
	      })
	.result.then(function(bm) { /* OK */
	  FbnServerCallService
	    .exec('/businessManager/api/linkBusinessManager', bm)
	    .then(function() {
	      $route.reload();
	    });
	  
	}, function() { /* Cancel */ });
    };

    $scope.unlinkBusinessManager = function(bm) {
      FbnServerCallService
	.exec('/businessManager/api/unlinkBusinessManager', bm)
	.then(function() {
	  $route.reload();
	});
    }
    
  })

// ================================================================

  .component('linkBusinessManagerEditor', {
    templateUrl: '/ng/views/fbn-business-manager-link.html',
    bindings: {
      resolve: '<',  // '<' and '=' resolving the function call before inheriting
      close: '&',    // '&' inheriting
      dismiss: '&',
      hasToken: '&',
    },
    controller: function ($scope) {
      var ctrl = $scope.$ctrl;
      
      _.remove(ctrl.resolve.clientBms,
      	       bm => 0 <= _.findIndex(ctrl.resolve.linkedBms,
      				      x => x.id === bm.id));
      
      $scope.availableBms = ctrl.resolve.clientBms;
      
      $scope.linkBusinessManager = function() {
	ctrl.close({ $value: $scope.bm });
      };

      $scope.cancel = function() {
	ctrl.dismiss({ $value: null });
      };
    }
  })

;
