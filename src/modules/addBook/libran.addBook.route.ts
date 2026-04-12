import express, { Request, Response } from "express";
import middlewares from '../../middlewares'
import libranAddBookController from "./libran.addbook.controller";
import { ApiResponse } from "../../utils/interfaces.util";
import { showOutput } from "../../utils/response.util";
import { verifyTokenUser } from "../../middlewares/auth.middleware";

const { multer } = middlewares.fileUpload

const router = express.Router();

router.post("/add_book", verifyTokenUser, multer.addToMulter.single('profile_pic'), async (req: Request, res: Response) => {
  const { title, author, isbn, genre, totalCopies, shelfLocation } = req.body;
  const controller = new libranAddBookController(req,res)
  const result: ApiResponse = await controller.addBook({ title, author, isbn, genre, totalCopies, shelfLocation });
      return showOutput(res, result, result.code)
});
router.put("/update_book",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
  const {book_id,title, author, isbn, genre, totalCopies, availableCopies, shelfLocation} = req.body
  const controller = new libranAddBookController(req,res)
  const result :ApiResponse = await controller.updateBook({book_id,title, author, isbn, genre, totalCopies, availableCopies, shelfLocation});
  return showOutput(res,result,result.code)
})
router.get("/get_books",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
  const {page, limit, author, genre, availability} = req.query
  const controller = new libranAddBookController(req,res)
  const result :ApiResponse = await controller.getBook(page, limit, author, genre, availability);
  return showOutput(res,result,result.code)
})
router.delete('/delete_book',verifyTokenUser,async(req:Request|any,res:Response|any)=>{
  const {book_id } = req.query;
   const controller = new libranAddBookController(req,res)
  const result :ApiResponse = await controller.deleteBook(book_id);
return showOutput(res,result,result.code)
})

export default router;