
const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  uri  =  "mongodb+srv://tuhanyesus:ampunilahdosakami@chat-test-4vpc2.mongodb.net/test?retryWrites=true&w=majority";
const  connect  =  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
module.exports  =  connect;