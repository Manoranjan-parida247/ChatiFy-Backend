import express from "express";
import {getAllContacts, getChatPartners, sendMessage, getMessageByUserId} from "../controllers/message.controller..js"
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessageByUserId);
router.post("/send/:id", sendMessage)



export default router;