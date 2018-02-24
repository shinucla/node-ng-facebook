'use strict';

angular.module('fbn')

  .controller('fbnHomeController', function($scope,
					    $route,
                                            FbnContextService,
                                            FbnAuthService,
                                            FbnServerCallService) {

    $scope.logout = function() {
      FbnAuthService.logout();
      $route.reload();
    };

    // Test getting data using ServerService.get
    //FbnHttpService
    //  .get('serverservice/product', { data: 'abc' })
    //  .then(function(products) {
    //    products.forEach(function(product) {
    //      console.log(product);
    //    });
    //  });

  });
