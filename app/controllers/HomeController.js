
// Home Controller

var routeToHome = function(req, res){
  var ip = req.connection.remoteAddress;
  res.sendFile(Config.ng_dir + '/views/index.html');
};

module.exports = function(app) {
  app
    .route('/')
    .get(routeToHome);

  app
    .route('/home')
    .get(routeToHome);

};
