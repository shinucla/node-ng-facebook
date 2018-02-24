var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var jwt      = require('jsonwebtoken');

var schema = mongoose.Schema({
  user_id          : { type: mongoose.Schema.Types.ObjectId },
  password_hash    : String,
  fb_adm_usr_token : String,
});

/*
 * ================================================================
 * public member methods:
 *   schema.methods.func1 = function() {
 *     xxxx
 *   });
 *
 *   to use: New Domain.UserProfile().func1();
 * ================================================================
 * public static methods:
 *   schema.statics.func2 = function() {
 *     xxxx;
 *   });
 *
 *   to use: Domain.UserProfile.func2();
 * ================================================================
 */


schema.statics.forUser = function(user) {
  return Domain.UserCredential.findOne({ 'user_id': (user || { _id: null })._id });
}

schema.statics.verifyToken = function(jwtToken, callback) {
  jwt.verify(jwtToken, Config.secret, callback); // callback(err, decodedUser)
};

schema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password_hash);
};

schema.statics.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


//================================================================

schema.methods.getAdminUserToken = function() {
  return (this.fb_adm_usr_token
	  ? AppString.decrypt(this.fb_adm_usr_token)
	  : null);
}

schema.methods.setAdminUserToken = function(token) {
  this.fb_adm_usr_token = (token ? AppString.encrypt(token) : null);

  return this;
}




module.exports  = schema;
