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

  .provider('FbnContextProvider', function() {
    var context = {};

    context.user = {firstname: 'Hello', lastname: 'World'};

    context.set = function(config) {
      context.user = {firstname: 'World', lastname: 'Hello'};
      console.log('from context provider');
    };

    this.$get = function() {
      return context;
    };
  })

  .factory('FbnContextService', function() {
    var context = {};

    context.user = {firstname: 'Hello', lastname: 'World'};

    context.set = function(config) {
      context.user = {firstname: 'World', lastname: 'Hello'};
      console.log('from context service');
    };

    return context;
  })

;
