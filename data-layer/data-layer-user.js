const mongoose = require('mongoose');

// User schema for mongodb
const UserSchema = mongoose.Schema({
	name: { type: String },
	email: { type: String },
	profileUrl: { type: String }
}, { collection: 'users' } );

// Define the mongoose model for use below in method
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByEmail = (email, callback) => {
      try {
            User.findOne({ email: email }, callback);
      } catch (err) {
            callback(err);
      }
};