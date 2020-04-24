
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    fName : String,
	lName : String, 
	vve_id : ObjectId,
	email : String,
	role : String
	passwordHash : String,
	passwordSalt : String
});
module.exports = mongoose.model('User', UserSchema);