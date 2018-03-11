'use strict';

angular.module('fbn')

  .controller('fbnHomeController', function($scope,
					    $route,
					    $window,
                                            FbnContextService,
                                            FbnAuthService,
                                            FbnServerCallService) {

    $scope.logout = function() {
      FbnAuthService.logout();
      $window.location.reload();
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
