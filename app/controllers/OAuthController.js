var request = require('request-promise');

module.exports = function(app) {
  var ver = 'v2.10';

  app
    .route('/oauth/api/facebook')
    .get(function(req, res) {
      var code = req.query.code;
      var encryptedUserId = req.query.uid;
      var state = req.query.state;
      var redirectUri = Config.web.domain + '/oauth/api/facebook';

      if (!encryptedUserId && !state) {
	res.json({ status: 100, error: 'not authorized' });
	  
      } else if (!state) {
        res.redirect('https://www.facebook.com/dialog/oauth'
                     + '?state=' + encryptedUserId
		     + '&client_id=' + Config.facebook.appId
                     + '&scope=ads_management,manage_pages,business_management'
                     + '&redirect_uri=' + redirectUri);

      } else {
	var uid = Domain.UserProfile.decryptUserId(state);
	
        request({ method: 'post',
		  uri: AppString.format('https://graph.facebook.com/{0}/oauth/access_token', ver),
		  json: true,
		  body: { client_id: Config.facebook.appId,
			  client_secret: Config.facebook.appSecret,
			  code: code,
			  redirect_uri: redirectUri }})
          .then(function(body) {
            var accessToken = body.access_token;
	    
            return request({ method: 'post',
                             uri: AppString.format('https://graph.facebook.com/{0}/oauth/access_token', ver),
                             json: true,
                             body: { client_id: Config.facebook.appId,
                                     client_secret: Config.facebook.appSecret,
                                     grant_type: 'fb_exchange_token',
                                     fb_exchange_token: accessToken }});
          })
          .then(function(body) {
	    return Domain.UserCredential
	      .findOne({ user_id: uid })
	      .then(function(doc) {
		return doc ? doc.setAdminUserToken(body.access_token).save() : null;
	      });
          })
	  .then(function(doc) {
	    res.json({ status: 200, result: 0 });
	  });
      }
    });
  
  app
    .route('/oauth/api/getEncryptedUserId')
    .post(app.apiRequiredLogin,
          function(req, res) {
            res.json({ status: 200, result: Domain.UserProfile.encryptUserId(req.user._id) });
          });

};
