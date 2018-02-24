var request = require('request-promise');
var ver = 'v2.10';

var ApiParam = function() {
  var map = {};

  return {
    addParam: function(k,v) {
      map[k] = v;
      return this;
    },

    getMap: function() {
      return map;
    },
  }
};

var tokenMap = {};

// ================================================================

module.exports = {
  getBusinessManagerList: function(user) {
    return new Promise(function(resolve) {
      Domain.UserCredential.forUser(user, function(error, doc) {
	token = doc.getAdminUserToken();

	request({ method: 'get',
                  json: true,
		  uri: 'https://graph.facebook.com/' + ver + '/me/businesses',
		  qs: (new ApiParam()
		       .addParam('access_token', token)
		       .getMap()),
		  //body: { access_token: token },
		  //headers: {
		  //  'User-Agent': 'Request-Promise'
		  //},
		})
          .then(function(result) {
            resolve(result && result.data
		    ? result.data :
		    []);
          });
      });
    });
  },

};
