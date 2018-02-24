var request = require('request-promise');

module.exports = function(app) {
  app
    .route('/businessManager/api/getLinkedPages')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    // TODO
	  });
  
  app
    .route('/businessManager/api/getClientPages')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    FB
	      .getClientPages(req.user)
	      .then(function(data) {
		res.json({ status: 200, result: data });
	      });
	  });
  
  app
    .route('/businessManager/api/linkPage')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    var page = { 'id': req.body.id, 'name': req.body.name, 'url': req.body.url };
	    // TODO
	  });
  
  app
    .route('/businessManager/api/unlinkPage')
    .post(app.apiRequiredLogin,
	  function(req, res) {
	    var page = { 'id': req.body.id, 'name': req.body.name };
	    
	  });
  
};




