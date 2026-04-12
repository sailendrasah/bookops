import express, { Request, Response } from "express";
import { verifyTokenUser } from "../../middlewares/auth.middleware";
import ReservationController from "../../modules/Reservcation/reservation.controller";
import { ApiResponse } from "../../utils/interfaces.util";
import { showOutput } from "../../utils/response.util";

const router = express.Router();


router.post(
  "/create_reservation",
  verifyTokenUser,
  async (req: Request | any, res: Response | any) => {
    const {member_id, bookId,totalBook_reserved,reserved_date} = req.body;

    const controller = new ReservationController(req, res);

    const result: ApiResponse = await controller.createReservation({
      bookId,
      member_id,
     totalBook_reserved,
     reserved_date
    });

    return showOutput(res, result, result.code);
  }
);
router.get("/get_reservation_book",verifyTokenUser,async(req: Request | any, res: Response | any)=>{
  const{_id} = req.query;
        const controller = new ReservationController(req, res);
    const result: ApiResponse = await controller.getreservedBook(_id);
    return showOutput(res, result, result.code);
})

router.put("/update_reservation_book",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
  const {_id,book_name,totalBook_reserved} = req.body;
    const controller = new ReservationController(req, res);
    const result: ApiResponse = await controller.updatereservedBook({_id,book_name,totalBook_reserved});
    return showOutput(res, result, result.code);
})


router.delete("/delete_reservation_book",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
  const {_id} = req.body;
    const controller = new ReservationController(req, res);
    const result: ApiResponse = await controller.DeletereservedBook({_id});
    return showOutput(res, result, result.code);
})
 export default router;

