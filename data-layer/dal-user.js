// dal = data access layer 
// File: dal-user.js
var db = require('../mock-database/db');

module.exports.getUserByEmail = (email) => {
      return db(email);
};