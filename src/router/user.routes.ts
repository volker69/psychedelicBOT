import { Router} from "express";
import userController from "../controller/user.controller";

const router = Router();

router.get('/user',(req,res)=>{
    userController.getUsersController(req,res);
})

 router.get('/user/:id',(req,res)=>{
    userController.getUserByIdController(req,res);
})

router.post('/user',(req,res)=>{
    userController.postUserController(req,res);
})

router.put('/user',(req,res)=>{
    userController.updateUserController(req,res);
})

router.delete('/user/:id',(req,res)=>{
    userController.deleteUserController(req,res);
}) /**/

export const userRoutes = router;