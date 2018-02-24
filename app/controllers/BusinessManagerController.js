var request = require('request-promise');

module.exports = function(app) {
  app
    .route('/businessManager/api/getHasAdminUserToken')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    Domain.UserCredential.forUser(req.user, function(err, user) {
	      res.json({ status: 200,
			 result: (null !== user.getAdminUserToken()) });
	    });
	  });
  
  app // testing only should be removed
    .route('/businessManager/api/getAdminUserToken')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    Domain.UserCredential.forUser(req.user, function(err, user) {
	      res.json({ status: 200, result: user.getAdminUserToken() });
	    });
	  });

  app
    .route('/businessManager/api/revokeAdminUserToken')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    Domain.UserCredential.forUser(req.user, function(err, user) {
	      user
		.setAdminUserToken(null)
		.save(function() {
		  res.json({ status: 200, result: {}});
		});
	    });
	  });

  app
    .route('/businessManager/api/getLinkedBusinessManagers')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    Domain.BusinessManager
	      .getAllLinkedBusinessManagers(req.user)
	      .then(function(bms) {
		res.json({ status: 200, result: bms });
	      });
	  });
  
  app
    .route('/businessManager/api/getClientBusinessManagers')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    FB
	      .getBusinessManagerList(req.user)
	      .then(function(data) {
		res.json({ status: 200, result: data });
	      });
	  });
  
  app
    .route('/businessManager/api/linkBusinessManager')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    var bm = { 'id': req.body.id, 'name': req.body.name };

	    Domain
	      .BusinessManager
	      .getOrCreate(req.user, bm)
	      .then(function(bm) {
		res.json({ status: 200, result: bm });
	      });
	  });
  
  app
    .route('/businessManager/api/unlinkBusinessManager')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    var bm = { 'id': req.body.id, 'name': req.body.name };
	    
	    Domain.BusinessManager
	      .findOne({ user_id: req.user._id, id: bm.id})
	      .then(function(bm) {
		if (!bm) {
		  res.json({ status: 100, result: 'not found' });

		} else {
		  return bm.setStatus(Domain.BusinessManager.StatusEnum.UNLINKED).save();
		}
	      })
	      .then(function(bm){
		res.json({ status: 200, result: bm });
	      });
	  });
  
};
