import express  from "express"
import { deletefriend,sendreq,acceptreq,declinereq,Incomingreq,Outgoingreq} from "../controller/friendreq.controller.js";
import { protectroutes } from "../middleware/auth.middleware.js";

const router=express.Router();

router.post("/sendreq/:id",protectroutes,sendreq);
router.post("/acceptreq",protectroutes,acceptreq);
router.post("/declinereq",protectroutes,declinereq);
router.get("/outgoingreq",protectroutes,Outgoingreq);
router.get("/incomereq",protectroutes,Incomingreq);
router.get("/deletefriend/:id",protectroutes,deletefriend);

export default router;