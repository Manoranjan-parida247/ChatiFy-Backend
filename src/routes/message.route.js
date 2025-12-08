import express from "express";
import {getAllContacts, getChatPartners, sendMessage, getMessageByUserId} from "../controllers/message.controller..js"
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/contacts",protectRoute, getAllContacts);
router.get("/chats",protectRoute, getChatPartners);
router.get("/:id",protectRoute, getMessageByUserId);
router.post("/send/:id",protectRoute, sendMessage)



export default router;