import express,{Request,Response} from 'express'
import { verifyTokenUser } from '../../middlewares/auth.middleware';
import inventory_bookCondition from './inventory.controller';
import { ApiResponse } from '../../utils/interfaces.util';
import { showOutput } from '../../utils/response.util';

const router = express.Router();

router.post("/book_condition",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
    const {bookId,book_condition,note,book_status} = req.body;
    const controller = new inventory_bookCondition(req,res)
    const result:ApiResponse=await controller.bookCondition({bookId,book_condition,note,book_status})
     return showOutput(res, result, result.code)
})

router.get("/getAll_book_condition",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
     const controller = new inventory_bookCondition(req,res)
    const result:ApiResponse=await controller.getBookCondition()
     return showOutput(res, result, result.code)
})
router.put("/update_book_condition",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
    const {id,book_condition,note,book_status} = req.body;
    const controller = new inventory_bookCondition(req,res)
    const result :ApiResponse = await controller.updateBookCondition({id,book_condition,note,book_status})
         return showOutput(res, result, result.code)
})
router.delete("/soft_delete_book_condition",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
     const{_id}=req.body;
     const controller = new inventory_bookCondition(req,res)
    const result :ApiResponse = await controller.deleteBook({_id})
         return showOutput(res, result, result.code)
})
export default router;  