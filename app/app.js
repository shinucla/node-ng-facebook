//
// app.js
// @author Kevin Zhuang
// @version
// @since 02/15/2018
//

// MAIN ENTRY
//=======================================================================

var express           = require('express');
var http              = require('http');
var https             = require('https');
var mongoose          = require('mongoose');
var flash             = require('connect-flash');

var favicon           = require('serve-favicon');
var bodyParser        = require('body-parser');
var cookieParser      = require('cookie-parser');
var session           = require('express-session');
var MongoSessionStore = require('connect-mongo')(session);
var fs                = require('fs');

// ================================================================
// Global Variables
// ================================================================
Config            = require('../config.js');
AppString         = require('./app-string.js');
FB                = require('./facebook-service-manager.js');

// Start the database connection
Domain = require('./domain-models.js'); // DAL
connectToDatabase();

var app = express();
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.static(Config.rs_dir)); // public resources: js css img fonts...
app.use(cookieParser());
app.use(session({ secret: Config.web.secret,
                  resave: false,
                  saveUninitialized: false,
                  store: new MongoSessionStore({ mongooseConnection: mongoose.connection }),
                  cookie: { maxAge: 180 * 60 * 1000 }
                }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  // res.locals.login = req.isAuthenticated; // ------- for passing to view engine
  // res.locals.session = req.session; ---------------- for passing to view engine
  next();
});



/* Steps to get SSL (https):
 * 1) Goto www.sslforfree.com follow the steps to download cert files
 * 2) Save the files and create the option map:
 * 3) https.createServer(https_op, app).listen(443);
 */
var https_op = { key: fs.readFileSync(Config.root + '/certs/ssl/private.key', 'utf8'),
		 ca: fs.readFileSync(Config.root + '/certs/ssl/ca_bundle.crt', 'utf8'),
		 cert: fs.readFileSync(Config.root + '/certs/ssl/certificate.crt', 'utf8') };

http.createServer(app).listen(Config.web.port);  // $sudo PORT=8080 node app.js
https.createServer(https_op, app).listen(443);   // starts https server


// If the Node process ends, close the Mongoose connection
var really_want_to_exit = false;
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('close mongo connection');
    really_want_to_exit = true;
    process.exit(0);
  });
});

mongoose.connection.on('connected', function () { // When successfully connected
  console.log('db connected');
});

mongoose.connection.on('disconnected', function () { // When the connection is disconnected
  console.log('db disconnected');

  connection_count = 0;
  connectToDatabase();
});

mongoose.connection.on('error',function (err) { // If the connection throws an error
  console.log('db error: ' + err);
});

var connection_count = 0;
function connectToDatabase() {
  mongoose.connect(Config.mongodb.url,
                   { server: { keepAlive: 1,
                               reconnectTries: Number.MAX_VALUE,
                               socketOptions: { connectTimeoutMS: Config.mongodb.dbTimeout },
                               poolSize: Config.mongodb.dbPoolSize },
                     replset: { keepAlive: 1,
                                socketOptions: { connectTimeoutMS: Config.mongodb.dbTimeout },
                                poolSize: Config.mongodb.dbPoolSize }
                   },
		   function(err) {
                     if (err) {
                       console.log('Cannot connect to mongodb');

                       if (connection_count < 50) {
                         reConnectToDatabase();

                       } else {
                         process.exit(1);
                       }
                     }

                     // post connection tasks:
                     Domain.UserProfile.ensureAdminUserExists(Config);

                     require('./router.js')(app);
                     console.log('Server Started ...');

                     //  var setter = (new Domain.TestSetter()
                     //                .setter('name', 'Kevin')
                     //                .setter('age', 12)
                     //                .setter('sex', 'male')
                     //                .save());
                   });
}

function reConnectToDatabase() {
  console.log('trying to reconnect to db in 10 sec.');

  ++connection_count;
  setTimeout(connectToDatabase, 10000);
}

