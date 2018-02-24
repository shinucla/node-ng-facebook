'use strict';

// To retrieve a reference to the same module for further 
// configuration, call angular.module without the array argument.
angular.module('fbn')

  .service('FbnSessionService', function() {
    this.create = function(sessionId, userId, userRole) {
      this.id = sessionId;
      this.userId = userId;
      this.userRole = userRole;
    };

    this.destroy = function() {
      this.id = null;
      this.userId = null;
      this.userRole = null;
    };

  })
;
