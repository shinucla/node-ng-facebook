angular.module('fbn')
  .directive('fbnHeaderNavbar', function() {

    return {
      templateUrl: '/ng/views/fbn-header-navbar.html',
      restrict: 'EA', // E = element, A = attribute, C = class, M = comment
      replace: true
    };

  });
