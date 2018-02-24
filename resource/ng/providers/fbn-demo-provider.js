'use strict';

angular.module('fbn')

  .provider('fbnDemoProvider', function() {

    this.someConfigFunc = function() {
      console.log('some function can be called: demoProvider.someConfigFunc(); ');
    };

    this.$get = function() {

      return {
	func1 : function() {
	  console.log('function 1 has been invoked by: demo.func1(); ');
	},
	func2 : function() {
	  console.log('function 2 has been invoked by: demo.func2(); ');
	}
      };
    };
  });
