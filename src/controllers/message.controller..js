
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/user.js";

//in this api , getting all the contact in the db
export const getAllContacts = async (req, res) => {
    try {
        const loggedInuserId = req.user._id;
        // getting all the users expect loggedinUser
        const filteredUser = await User.find({ _id: { $ne: loggedInuserId } }).select("-password");
        // console.log(filteredUser);
        res.status(200).json({
            statusCode: 200,
            message: "All contacts fetched successfully!",
            data: filteredUser
        })

    } catch (err) {
        console.log("Error in message controller :", err);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
            error: err.message
        })
    }
}

// in this getting message between two user(looggedInUser and other user)
export const getMessageByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        })

        res.status(200).json({
            statusCode: 200,
            message: "Chat fetched succesfully",
            data: messages,
        })
    } catch (err) {

    }
}


// In this api , logic of sending message
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({
                statusCode: 400,
                message: "text or message is required"
            })
        }

        if (senderId.toString().equeals(receiverId.toString())) {
            return res.status(400).json({
                statusCode: 400,
                message: "Can not send message to yourself"
            })
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();
        // TODO: adding socket code for real time

        res.status(201).json({
            statusCode: 201,
            messages: "Message send successfully",
            data: newMessage
        })
    } catch (err) {
        console.log("error in send message controller:", err);
        res.status(500).json({
            statusCode: 500,
            message: "INternal server error",
            error: err.message,
        })
    }
}
export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        //find all the message where loggedIn user is either sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        })


        const chatPartenerIds = [...new Set(messages.map((msg) => msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()))]
        // console.log(chatPartenerIds)

        const chatParteners = await User.find({_id: {$in: chatPartenerIds}}).select("-password");

        res.status(200).json({
            statusCode: 200,
            message: "Chat partners fetched successfully",
            data: chatParteners
        })
    } catch (err) {
        console.log("errror in getChatPartners controller :", err);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
            error: err.message
        })
    }
}