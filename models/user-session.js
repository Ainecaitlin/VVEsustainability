var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSessionSchema = new Schema({
    sessionId: String,
    userId: String
});

module.exports = mongoose.model('UserSession', UserSessionSchema);