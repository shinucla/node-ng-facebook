'use strict';

// To retrieve a reference to the same module for further
// configuration, call angular.module without the array argument.
angular.module('fbn')

// API Service
// factory is not configurable service
// in order to be able to inject into app.config, service need to be defined using provider
  .factory('FbnApiService', function($http, $q) {

    return {


      get : function(url) {
        var defer = $q.defer();

        $http
          .get(url)
          .success(function(data, status, headers, config) {
            defer.resolve(data);
          })
          .error(function(data, status, headers, config) {
            defer.reject({result: null});
          });

        return defer.promise;
      },

      post: function(url, payload) {
	var defer = $q.defer();

        $http
          .post(url, payload)
          .success(function(data, status, headers, config) {
            defer.resolve(data);
          })
          .error(function(data, status, headers, config) {
            defer.reject({result: null});
          });
	
	return defer.promise;
      },

      put: function(url, data) {
	var defer = $q.defer();
	
        $http
	  .put(url, data)
	  .success(function(data, status, headers, config) {
	    defer.resolve(data);
	  })
	  .error(function(data, status, headers, config) {
	    defer.reject({result: null});
	  });

	return defer.promise;
      },

      delete: function(url, payload) {
	var defer = $q.defer();
	
        $http
	  .delete(url, payload)
	  .success(function(data, status, headers, config) {
	    defer.resolve(data);
	  })
	  .error(function(data, status, headers, config) {
	    defer.reject(data);
	  });

	return defer.promise;
      }
    };

  });
