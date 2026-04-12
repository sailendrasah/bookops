import Fine from "../../modules/fine/fine.modal";
import borrow_bookModal from "../../modules/Borrow_book/borrow_book.modal";
import moment from "moment";
import { showResponse } from "../../utils/response.util";
import statusCodes from "../../constants/statusCodes";
import { ApiResponse } from "../../utils/interfaces.util";
import mongoose from "mongoose";
const fineHandler = {
  addFine: async (request: any): Promise<ApiResponse> => {
    const { borrowId, returnDate, userId,isPaid,isFineCancel } = request;

    const borrow = await borrow_bookModal.findById(borrowId);

    if (!borrow) {
      return showResponse(false, "Borrow not found", null, statusCodes.API_ERROR);
    }

    const lastDate = moment(borrow.lastDate, "YYYY-DD-MMM");
const actualReturn = moment(returnDate, "YYYY/MM/DD");

    const lateDays = actualReturn.diff(lastDate, "days");


    let fineAmount = 0;

    if (lateDays > 0) {
      fineAmount = lateDays * 5;
    }

    const existingFine = await Fine.findOne({ borrow_id: borrowId });

    if (existingFine) {
      return showResponse(false, "Fine already exists", existingFine, statusCodes.API_ERROR);
    }

    const fine = await Fine.create({
      borrow_id: borrowId,
      member_id: borrow.member_id,
      book_id: borrow.book_id,
      fineAmount,
      returnDate: actualReturn,
      isPaid,
      isFineCancel,
      userId
    });

    return showResponse(
      true,
      lateDays > 0 ? `Fine applied ₹${fineAmount}` : "No fine",
      fine,
      statusCodes.SUCCESS
    );
  },
  updateFine: async (request: any): Promise<ApiResponse> => {
    const { borrowId, returnDate, isPaid, isFineCancel } = request;

    const borrow = await borrow_bookModal.findById(borrowId);
    if (!borrow) {
      return showResponse(false, "Borrow not found", null, statusCodes.API_ERROR);
    }

    const lastDate = moment(borrow.lastDate); 
    const actualReturn = moment(new Date(returnDate));

    if (!actualReturn.isValid()) {
      return showResponse(false, "Invalid return date", null, statusCodes.VALIDATION_ERROR);
    }

    let lateDays = actualReturn.diff(lastDate, "days");
    if (lateDays < 0) lateDays = 0; 

    const fineAmount = lateDays * 5;

    const fine = await Fine.findOne({ borrow_id: borrowId });

    if (!fine) {
      return showResponse(false, "Fine not found", null, statusCodes.API_ERROR);
    }

fine.returnDate = actualReturn.format("YYYY-MM-DD");
    fine.fineAmount = fineAmount;
    fine.isPaid = isPaid ?? fine.isPaid;
    fine.isFineCancel = isFineCancel ?? fine.isFineCancel;

    await fine.save();

    return showResponse(
      true,
      lateDays > 0
        ? `Fine updated ₹${fineAmount}`
        : "No fine after update",
      fine,
      statusCodes.SUCCESS
    );
  },
  getfine:async(data:any):Promise<ApiResponse>=>{
    const {_id} = data;
 if (!_id) {
      return showResponse(false, "please  provide _id", statusCodes.API_ERROR);
    }
    const fineDetail = await Fine.aggregate([
      {
        $match:{
          _id: new mongoose.Types.ObjectId(_id)
        }
      },
      {
        $lookup:{
          from:"borrows",
          localField:"borrow_id",
          foreignField:"_id",
          as:"borrowDetail"
        }
      },
     {   $unwind: {
      path: "$borrowDetail",
      preserveNullAndEmptyArrays: true
     }
    },
      {
        $lookup:{
           from: "members", 
      localField: "member_id",
      foreignField: "_id",
      as: "member"
        }
      },
       {
    $unwind: {
      path: "$member",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup:{
      from:"books",
      localField:"book_id",
      foreignField:"_id",
      as:"bookdetail"
    }
  },
    {
    $unwind: {
      path: "$bookdetail",
      preserveNullAndEmptyArrays: true
    }
  },
    {
    $project: {
      _id: 1,
      fineAmount: 1,
      returnDate: 1,
      isPaid: 1,
      borrow_id:1,
      member_id:1,
      book_id:1,

      "borrowDetail.issueDate": 1,
      "borrowDetail.lastDate": 1,
      "borrowDetail.status": 1,

      "member.name": 1,
      "member.email": 1,
      "member.joinStatus": 1,
      "member.Address": 1,

      "bookdetail.title": 1,
      "bookdetail.author": 1,
      "bookdetail.isbn": 1
    }
  }
    ]);
    if(!fineDetail){
       return showResponse(false, "mot fount fine detail", statusCodes.API_ERROR);
    }
     return showResponse(
      true,
     "fine detail fetch successfully",
     fineDetail,
      statusCodes.SUCCESS
    );
  },
  delete:async(data:any):Promise<ApiResponse>=>{
    const {_id} = data;
    if (!_id) {
      return showResponse(false, "please  provide _id", statusCodes.API_ERROR);
    }
    const item = await Fine.findByIdAndDelete(_id)
    if(!item){
        return showResponse(false, "mot fount fine record", statusCodes.API_ERROR);
    }
      return showResponse(
      true,
     "fine record deleted successfully",
     item,
      statusCodes.SUCCESS
    );
  }
};
export default fineHandler