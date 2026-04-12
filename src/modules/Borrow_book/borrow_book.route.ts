import express, { Request, Response } from "express";
import { ApiResponse } from "../../utils/interfaces.util";
import { showOutput } from "../../utils/response.util";
import { verifyTokenUser } from "../../middlewares/auth.middleware";
import BorrowController from "../../modules/Borrow_book/borrow_book.controller";

const router = express.Router();


router.post("/add_borrow", verifyTokenUser, async (req: Request|any, res: Response|any) => {
  const { member_id, book_id, issueDate, lastDate } = req.body;

  const controller = new BorrowController(req, res);
  const result: ApiResponse = await controller.addBorrow({
    member_id,
    book_id,
    issueDate,
    lastDate
  });

  return showOutput(res, result, result.code);
});
router.get("/get_borrow_book",verifyTokenUser,async(req: Request|any, res: Response|any)=>{
  const {_id} = req.query
  const controller = new BorrowController(req, res);
  const result: ApiResponse = await controller.getBorrowBook(_id);

  return showOutput(res, result, result.code);
})
router.put("/update_borrow_book",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
  const {_id, lastDate, status, renewCount,issueDate} = req.body;
   const controller = new BorrowController(req, res);
  const result: ApiResponse = await controller.update_borrow_book({_id,lastDate,status,renewCount,issueDate});

  return showOutput(res, result, result.code)
})

router.delete("/delete_borrow_book",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
  const {_id} = req.body;
   const controller = new BorrowController(req, res);
  const result: ApiResponse = await controller.delete_borrow_book({_id});

  return showOutput(res, result, result.code)
})

export default router;