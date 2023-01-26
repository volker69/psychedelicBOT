import { Router} from "express";
import commandController from "../controller/command.controller";

const router = Router();

router.post('/makeCommand',(req,res)=>{
    commandController.postCommand(req,res);
})

export const commandRouter = router;