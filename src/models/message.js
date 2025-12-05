import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type:String,
        required: true,
        ref: "User"
    },
    receiverId: {
        type: String, 
        required: true,
        ref: "User"
    }, 
    text: {
        type: String,
        trim: true,
        maxLength: 1000,
    },
    image:{
        type: String
    }
}, {
    timestamps: true
})

const Message = mongoose.model("Message", messageSchema);
export default Message;