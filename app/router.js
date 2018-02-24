
/**
 * Register controllers here.
 */

module.exports = function(app) {

  app.apiRequiredLogin = function(req, res, next) {
    var token = req.headers.jwt;

    if (!!token) {
      Domain.UserProfile.verifyToken(token, function(err, user) {
        if (!err) {
          req.user = user;
          next();

        } else {
          res.json({ status: 200,
                     error: { code: 'NOT_AUTHORIZED', text: 'not authorized' }
                   });
        }
      });

    } else {
      res.json({ status: 200,
                 error: { code: 'NOT_AUTHORIZED', text: 'not authorized' }
               });
    }
  };

  app.series = function() {
    var callbacks = Array.prototype.slice.call(arguments);
    var args = {};

    function next() {
      var callback = callbacks.shift();
      if (callback) {
        callback(args, function() {
          args = arguments;
          next();
        });
      }
    }
    next();
  };

  require('./controllers/HomeController')(app);
  require('./controllers/LoginController')(app);
  require('./controllers/OAuthController')(app);
  require('./controllers/BusinessManagerController')(app);
}
