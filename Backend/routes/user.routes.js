import {Router} from "express"
import { Editprofile, fetchprofile } from "../controller/user.controller.js";
import { protectroutes } from "../middleware/auth.middleware.js";



const router=Router();

router.put("/update",protectroutes,Editprofile);
router.get("/fetchprofile/:id",protectroutes,fetchprofile);



export default router;