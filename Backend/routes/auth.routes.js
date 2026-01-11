import express from "express"
import {Signup,Login,Logout,checkauth,fetchusers}  from "../controller/auth.controller.js"
import { protectroutes } from "../middleware/auth.middleware.js";

const router=express.Router();


router.post("/signup",Signup);
router.post("/Login",Login);
router.get("/Logout",Logout);
router.get("/check",protectroutes,checkauth);
router.get("/fetchusers",protectroutes,fetchusers);


export default router;