var request = require('request-promise');

module.exports = function(app) {
  app
    .route('/businessManager/api/getHasAdminUserToken')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    Domain.UserCredential
	      .forUser(req.user)
	      .then(function(doc) {
		res.json({ status: 200, result: (null !== doc.getAdminUserToken()) });
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
	    Domain.UserCredential
	      .forUser(req.user)
	      .then(function(user) {
		return user.setAdminUserToken(null).save();
	      })
	      .then(function() {
		res.json({ status: 200, result: 0 });
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
	      .withUser(req.user)
	      .getBusinessManagerList()
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
	      })
	      .catch(function(e){
		res.json({ status: 100, result: e });
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
