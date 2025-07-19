import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
  getMessages,
  getUserForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../Controllers/MessageController.js";

const MessageRouter = express.Router();

MessageRouter.get("/users", protectRoute, getUserForSidebar);

MessageRouter.get("/:id", protectRoute, getMessages);

MessageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

MessageRouter.post("/send/:id", protectRoute, sendMessage);
export default MessageRouter;
