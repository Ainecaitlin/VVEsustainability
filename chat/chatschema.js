const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  chatSchema  =  new Schema(
    {
    text: {
    type: String
    },
    user: {
    type: String
        }
    },
        {
    time: {
        timestamps: {
            type: String,
            type: String
        }
    }
    
});

let  Chat  =  mongoose.model("Chat", chatSchema);
module.exports  =  Chat;