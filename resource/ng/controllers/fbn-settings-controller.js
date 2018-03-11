'use strict';

angular.module('fbn')
  .controller('fbnSettingsController', function($scope,
						$window,
						$q,
						$route,
						$location,
						$uibModal,
						$document,
						$log,
						FbnServerCallService,
						FbnFacebookService) {
    
    $scope.hasAdminUserToken = null;
    FbnServerCallService.exec('/businessManager/api/getHasAdminUserToken').then(function(b) { $scope.hasAdminUserToken = b; });
    FbnServerCallService.exec('/businessManager/api/getLinkedBusinessManagers').then(function(bms) { $scope.bms = bms; });
    FbnFacebookService.getMe(function(me) { $scope.me = me; });

    $scope.authenticateFbAccess = function() {
      return FbnFacebookService.authenticateFbAccess();
    };

    $scope.resetFbAccess = function() {
      return FbnFacebookService.resetFbAccess();
    };

  })

;
