var mongoose = require('mongoose');

var schema = mongoose.Schema({
  user_id:       {type: mongoose.Schema.Types.ObjectId},
  id  :          String,
  name:          String,
  status:        Number,
});

//================================================================

schema.statics.StatusEnum = { LINKED:   { id: 1, label: 'Linked' },
			      UNLINKED: { id: 2, label: 'Unlinked' },
			      INACTIVE: { id: 3, label: 'Inactive' },
			    };

schema.statics.getAllLinkedBusinessManagers = function(user) {
  return new Promise(function(resolve, reject) {
    Domain.BusinessManager.find({ user_id: user._id,
				  status: Domain.BusinessManager.StatusEnum.LINKED.id },
				function(err, docs) {
				  if (err) reject(err);
				  else resolve(docs);
				});
  });
};

schema.statics.create = function(user, bm) {
  return new Domain.BusinessManager()
    .setUserId(user._id)
    .setId(bm.id)
    .setName(bm.name)
    .setStatus(Domain.BusinessManager.StatusEnum.LINKED)
  ;
};

schema.statics.getOrCreate = function(user, bm) {
  var newBm = Domain.BusinessManager.create(user, bm);

  return new Promise(function(resolve, reject) {
    Domain.BusinessManager
      .findOne({ user_id: user._id, id: bm.id })
      .then(function(err, doc) {
	if (err) {
	  reject(err);
	  
	} else if (doc) {
	  doc
	    .setStatus(Domain.BusinessManager.StatusEnum.LINKED)
	    .save()
	    .then(function(doc) {
	      resolve(doc);
	    });
	  
	} else {
	  newBm.save().then(function(doc) { resolve(doc); });
	}
      });
  });
}

// ================================================================

schema.methods.setUserId = function(val) { this.user_id = val; return this; };
schema.methods.setId = function(val) { this.id = val; return this; };
schema.methods.setName = function(val) { this.name = val; return this; };
schema.methods.setStatus = function(statusEnum) { this.status = statusEnum.id; return this; };


// ================================================================

module.exports  = schema;

