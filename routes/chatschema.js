
const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  chatSchema  =  new Schema(
    {
    sender: {
    type: Schema.Types.String,
    },
    chatroom: {
    type: Schema.Types.String,
    },
	message: {
		type: Schema.Types.String,
	}
});

module.exports  =  mongoose.model('Chat',chatSchema);

