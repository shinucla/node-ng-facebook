'use strict';

// To retrieve a reference to the same module for further 
// configuration, call angular.module without the array argument.
angular.module('fbn')

  .provider('FbnHttpStatusService', function($rootScope) {
    var service = {};

    service.variable = { attribute1: 'Hello', attribute2: 'World' };

    service.myFunction = function(config) {
      service.variable = { attribute1: 'World', attribute2: 'Hello'};
    };

    service.getHttpStatusEnum = function(response, status, headers, config) {
      // ...... tbi
    };


    this.$get = function() {
      return service;
    };
  });
