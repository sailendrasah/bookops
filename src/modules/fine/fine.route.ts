import express,{Request,Response} from 'express';
import { verifyTokenUser } from '../../middlewares/auth.middleware';
import fineController from './fine.controller';
import { ApiResponse } from '../../utils/interfaces.util';
import { showOutput } from '../../utils/response.util';
const router = express.Router();

router.post("/add_fine",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
const {member_id,borrowId,book_id,returnDate,isPaid ,paidDate,isFineCancel} = req.body
  const controller = new fineController (req, res);
  const result: ApiResponse = await controller.addFine({member_id,borrowId,book_id,returnDate,isPaid ,paidDate,isFineCancel});

  return showOutput(res, result, result.code)
})

router.put("/update_fine",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
const {borrowId,returnDate,isPaid ,paidDate,isFineCancel} = req.body
  const controller = new fineController (req, res);
  const result: ApiResponse = await controller.updateFine({borrowId,returnDate,isPaid ,paidDate,isFineCancel});

  return showOutput(res, result, result.code)
})


router.get("/get_fine",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
const {_id} = req.query
  const controller = new fineController (req, res);
  const result: ApiResponse = await controller.getFine(_id);

  return showOutput(res, result, result.code)
})

router.delete("/delete_fine",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
const {_id} = req.body
  const controller = new fineController (req, res);
  const result: ApiResponse = await controller.deleteFine({_id});

  return showOutput(res, result, result.code)
})

export default router 