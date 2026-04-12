import express,{Request,Response}  from  'express'
import { verifyTokenUser } from '../../middlewares/auth.middleware'
import joinmember from './member.controller';
import { ApiResponse } from '../../utils/interfaces.util';
import { showOutput } from '../../utils/response.util';

const router = express.Router()

router.post("/join_member",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
    const{memberShipType} = req.body;
    const controller =  new joinmember(req,res)
    const result:ApiResponse = await controller.joinMember({memberShipType});
     return showOutput(res, result, result.code)  
})
router.get("/get_member",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
    const {_id} = req.query;
    const controller =  new joinmember(req,res)
    const result:ApiResponse = await controller.getMember(_id);
     return showOutput(res, result, result.code)  
})
router.put("/update_member",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
    const {_id,name,Address,memberShipType} = req.body
    const controller =  new joinmember(req,res)
    const result:ApiResponse = await controller.updatemember({_id,name,Address,memberShipType});
     return showOutput(res, result, result.code) 
})

router.delete("/soft_delete",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
    const {_id} = req.body
    const controller =  new joinmember(req,res)
    const result:ApiResponse = await controller.softDelete({_id});
     return showOutput(res, result, result.code) 
})
export default router;