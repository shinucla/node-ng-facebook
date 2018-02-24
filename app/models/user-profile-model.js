MAX_LOGIN_ATTEMPTS = 5;
var LOCKED_TIME = 1000 * 60 * 60 * 2;  // two hours

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var jwt      = require('jsonwebtoken');

var schema = mongoose.Schema({
  firstname      : String,
  lastname       : String,
  email          : String,

  status_bit     : Number,   // 0: delete 1: active 2: inactive
  role           : String,   // lower case: admin, canread, canwrite

  login_attempts : Number,
  locked_until   : Date,
});

schema.statics.signupUser = function(jsonUser, callback) {
  // callback(Error, Domain.UserProfile entity)
  var regex    = new RegExp(["^", jsonUser.email, "$"].join(""), "i");

  Domain
    .UserProfile
    .findOne({'email': regex }, function(err, user) {
      if (err) return callback(err.toString(), null);
      if (user) return callback('That email is already taken.', null);

      // if there is no user with that email
      var newUser            = new Domain.UserProfile();
      newUser.email          = jsonUser.email;
      newUser.firstname      = jsonUser.firstname;
      newUser.lastname       = jsonUser.lastname;
      newUser.login_attempts = 1;
      newUser.role           = 'member';

      newUser.save(function() {
        var newUserCredential = new Domain.UserCredential();
        newUserCredential.user_id = newUser._id;
        newUserCredential.password_hash = Domain.UserCredential.generateHash(jsonUser.password);

        newUserCredential.save(function(err2) {
          callback(err2, jwt.sign(newUser, Config.secret));
        });
      });
    });
};

schema.statics.loginUser = function(jsonUser, callback) {
  // callback(Error, Domain.UserProfile entity)
  var regex = new RegExp(["^", jsonUser.email, "$"].join(""), "i");

  Domain.UserProfile.findOne({'email': regex}, function(err, user) {
    Domain.UserCredential.findOne({'user_id': (user || {_id: null})._id}, function(err, credential) {

      // 1) User not found
      if (err || !user) {

        return callback('The email or password you entered is incorrect!!!.', null);

        // 2) User Found With Locked Account
      } else if (Date.now() < user.locked_until) {

        return callback('This account has been locked until ' + user.locked_until, null);

        // 3) User Found with Correct Password
      } else if (credential.validPassword(jsonUser.password)) {

        return (Domain // this return here is very important!!!
                .UserProfile
                .update({_id: user._id}, {login_attempts : 1}, function(err2, num) {

                  return callback(err2, jwt.sign(user, Config.secret));
                }));

        // 4) User Found With Incorrect Password
        // 5) and MAX_LOGIN_ATTEMPTS <= Login Attempts
      } else if (MAX_LOGIN_ATTEMPTS <= user.login_attempts) {

        return (Domain
                .UserProfile
                .update({_id: user._id}, {login_attempts: 1, locked_until: Date.now() + LOCKED_TIME}, function(err2, num) {

                  return callback('This account has been locked.', null);
                }));

        // 6) Login Attempts < MAX_LOGIN_ATTEMPTS
      } else {

        return (Domain
                .UserProfile
                .update({_id: user._id}, {$inc: {login_attempts: 1}}, function(err2, num) {

                  return callback('This account will be locked after ' +
                                  (MAX_LOGIN_ATTEMPTS - user.login_attempts) +
                                  ' more failed logins.', null);
                }));
      }
    });
  });
};

schema.statics.ensureAdminUserExists = function(config) {
  var newUser            = new Domain.UserProfile();
  newUser.email          = config.admin.email,
  newUser.firstname      = config.admin.firstname;
  newUser.lastname       = config.admin.lastname;
  newUser.login_attempts = 1;
  newUser.role           = 'admin';

  var regex    = new RegExp(["^", newUser.email, "$"].join(""), "i");

  Domain
    .UserProfile
    .findOne({'email': regex }, function(err, user) {
      if (!err && !user) {
        newUser.save(function() {
          var newUserCredential = new Domain.UserCredential();
          newUserCredential.user_id = newUser._id;
          newUserCredential.password_hash = Domain.UserCredential.generateHash(config.admin.password);
          newUserCredential.save();
        });
      }
    });
};

schema.statics.verifyToken = function(jwtToken, callback) {
  // callback(err, decodedUser)
  // jwt.verify(jwtToken, secret, callback);

  jwt.verify(jwtToken, Config.secret, function(err, decodedUser) {
    if (err) {
      callback(err, null);
    
    } else {
      Domain.UserProfile.findOne({ _id : decodedUser._doc._id}, function(err, doc) {
	if (doc) {
	  callback(null, doc);
	
	} else {
	  callback('invalid user', null);
	}
      });
    }
  }); 
};

// return a promise: 
// Domain.UserProfile
//   .forEmail('...')
//   .then(function(user) {
//         ...
//    });
schema.statics.forEmail = function(email) {
  return this.findOne({email: email}).exec();
};


schema.statics.encryptUserId = function(id) {
  return AppString.encrypt(id.toString());
}

schema.statics.decryptUserId = function(id) {
  return AppString.decrypt(id);
}


module.exports  = schema;
