import express from "express"
import {getMessage,fetchfriends,sendMessage,getuser, deleteMessage, deleteforme, Markasseen } from "../controller/message.controller.js";
import { protectroutes } from "../middleware/auth.middleware.js";
import { geminiLimiter } from "../utils/ratelimit.js";


const router=express.Router();

router.get("/friends",protectroutes,fetchfriends);
router.get("/user",protectroutes,getuser);
router.get("/:id",protectroutes,getMessage);
router.post("/send",protectroutes,geminiLimiter,sendMessage);
router.get("/deletemess/:id",protectroutes,deleteMessage);
router.get("/deletemessforMe/:id",protectroutes,deleteforme);
router.put("/markasseen/:id",protectroutes,Markasseen);




export default router;