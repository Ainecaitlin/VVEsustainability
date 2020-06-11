const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  chatroomMasterTable  =  new Schema(
    {
    name: {
    type: Schema.Types.String,
    },
    room_names: {
    type: Schema.Types.Array,
    },
});

module.exports  =  chatroomMasterTable;