var request = require('request-promise');

/* Example:
 * request({ method: 'get',
 *           json: true,
 * 	     uri: 'https://graph.facebook.com/' + ver + '/me/businesses',
 * 	     qs: (new ApiParam()
 * 		 .addParam('access_token', token)
 * 		 .getMap()),
 * 	     body: { access_token: token },
 * 	     headers: {
 * 	       'User-Agent': 'Request-Promise'
 * 	     },
 *        })
*/

var ver = 'v2.10';
var graph_api_url = 'https://graph.facebook.com/' + ver;


var TokenMap = {};

// ================================================================

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

// ================================================================

function get_call(user, path, param) {
  try {
    return (getToken(user)
	    .then(function(token) {
	      console.log(token);
	      return request({ method: 'get',
			       json: true,
			       uri: graph_api_url + path,
			       qs: param.addParam('access_token', token).getMap()
			     });
	    })
	    .catch(function(e) {
	      return e;
	    }));
    
  } catch (err) {
    return err;
  }
}

function post_call(path, param) {
  try {
    
  } catch (err) {
  }
}

function getToken(user) {
  var id = user._id.toString();
  
  return new Promise(function(resolve) {
    if (TokenMap[id]) {
      resolve(TokenMap[id]);
      
    } else {
      Domain.UserCredential
	.forUser(user)
	.then(function(doc) {
	  TokenMap[id] = doc.getAdminUserToken();
	  
	  resolve(doc.getAdminUserToken());
	});
    }
  });
}

// ================================================================

// define a function type class
function FacebookServiceManager(user) {
  this.user = user;
}

FacebookServiceManager.prototype = {
  constructor: FacebookServiceManager, 
  
  getBusinessManagerList: function() {
    var param = new ApiParam();
    
    return get_call(this.user, '/me/businesses', param).then(function(result) {
      return (result && result.data
	      ? result.data :
	      []);
    });
  },

  getMe: function() {
    var param = new ApiParam().addParam('fields', 'id,name,email');
    
    return get_call(this.user, '/me', param).then(function(map) {
      return (!map || map.error
	      ? map.error
	      : map);
    });
  },
  
};
  
// ================================================================

module.exports = {
  withUser: function(user) {
    return new FacebookServiceManager(user);
  },
};
