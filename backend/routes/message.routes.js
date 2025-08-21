import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getAllUsers, getMessages, sendMessage } from "../controllers/message.controller.js";
const messageRouter = express.Router();

messageRouter.get("/users",isAuthenticated,getAllUsers)
messageRouter.get("/:id",isAuthenticated,getMessages)
messageRouter.post("/send/:id",isAuthenticated,sendMessage);

export default messageRouter;