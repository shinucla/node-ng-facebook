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
                     + '&scope=business_management,ads_management,email'
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
	    res.redirect('/');
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


/* generating token for admin system user and system user:


    IRipContext context = RipContext.get();
    String action = context.getString("state");
    String redirectUri = "https://advantage.advertiserreports.com:443/rip/oauth/facebookSystemUserToken";
    FacebookCredential credential = FacebookCredential.forAccessTokens("", "");

    if ("getCode".equals(action)) {
      context.setRedirectUrl(Url.absolute("https://www.facebook.com/dialog/oauth",
                                          Bindings.make("state", "getToken",
                                                        "client_id", credential.getAppId(),
                                                        "scope", "ads_management,business_management,manage_pages",
                                                        "redirect_uri", redirectUri)));
      return null;

    } else if ("getToken".equals(action)) {
      String adminUserToken
        = new BsdJson.Map(handlePost("https://graph.facebook.com/" + FacebookCommunicator.API_VERSION + "/oauth/access_token",
                                     "client_id", credential.getAppId(),
                                     "client_secret", credential.getAppSecret(),
                                     "code", context.getString("code"),
                                     "redirect_uri", redirectUri))
        .getString("access_token")
        ;

      String adminSystemUserToken
        = new BsdJson.Map(handlePost(String.format("https://graph.facebook.com/" + FacebookCommunicator.API_VERSION + "/%s/access_tokens",
                                                   credential.getAdminSystemUserId()),
                                     "business_app", credential.getAppId(),
                                     "scope", "ads_management,business_management,manage_pages",
                                     "appsecret_proof", StringX.hmacSha256(credential.getAppSecret(), adminUserToken).toLowerCase(),
                                     "access_token", adminUserToken))
        .getString("access_token");

      String systemUserToken
        = new BsdJson.Map(handlePost(String.format("https://graph.facebook.com/" + FacebookCommunicator.API_VERSION + "/%s/ads_access_token",
                                                   credential.getSystemUserId()),
                                     "business_app", credential.getAppId(),
                                     "scope", "ads_management,business_management,manage_pages",
                                     "appsecret_proof", StringX.hmacSha256(credential.getAppSecret(), adminSystemUserToken).toLowerCase(),
                                     "access_token", adminSystemUserToken))
        .getString("access_token");

      Credentials.get()
        .setFacebookSystemUserCredential(FacebookCredential
                                         .forAccessTokens(adminSystemUserToken,
                                                          systemUserToken))
        .persist();

   
*/
