'use strict';

angular.module('fbn')
  .controller('fbnPageController', function($scope,
					    $window,
					    $q,
					    $route,
					    $location,
					    $uibModal,
					    $document,
					    $log,
					    FbnServerCallService) {

    $scope.hasAdminUserToken = null;
    FbnServerCallService.exec('/businessManager/api/getHasAdminUserToken').then(function(b) { $scope.hasAdminUserToken = b; });
    FbnServerCallService.exec('/businessManager/api/getLinkedBusinessManagers').then(function(bms) { $scope.bms = bms; });
    //FbnServerCallService.exec('/businessManager/api/getLinkedPages').then(function(pages) { $scope.pages = pages; });
    

    /* The whole thing can be encapsulated into a service
     *    FbnDialog
     *      .editor({ templateUrl: '',
     *                bindings: { records: promise,
     *                            record: obj,
     *                          },
     *             })
     *      .result(function(data) {
     *         // TODO
     *      })
     *      .catch(function(err) {
     *         // TODO
     *      })  
     */
  })

;
