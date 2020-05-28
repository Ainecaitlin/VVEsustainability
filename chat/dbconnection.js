
const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  uri  =  "mongodb+srv://localhost:27071/VVE-DB";
const  connect  =  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
module.exports  =  connect;
