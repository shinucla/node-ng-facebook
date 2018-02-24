var mongoose = require('mongoose');

//             camel                           table                                snake
module.exports.UserProfile    = mongoose.model('user_profile',    require('./models/user-profile-model.js'));
module.exports.UserCredential = mongoose.model('user_credential', require('./models/user-credential-model.js'));
module.exports.BusinessManager = mongoose.model('business_manager', require('./models/business-manager-model.js'));

