import statusCodes from "../../constants/statusCodes";
import ReservationModel from "../../modules/Reservcation/reservation.modal";
import { showResponse } from "../../utils/response.util";
import Book from '../../modules/addBook/libarian.adBook.model'
import Member from "../member/member.modal";
import moment from "moment";
import mongoose from "mongoose";

const revervationhandler ={

 createReservation : async (data: any) => {
  const { member_id, bookId,totalBook_reserved,reserved_date } = data;
 const book = await Book.findOne({
  _id: bookId,
  isActive: { $ne: 2 }
});

if (!book) {
  return showResponse(
    false,
    "Book not found",
    null,
    statusCodes.API_ERROR
  );
}
const member = await Member.findOne({
  _id: member_id,
  joinStatus: { $ne: 2 }
});

if (!member) {
  return showResponse(
    false,
    "Member not found",
    null,
    statusCodes.API_ERROR
  );
}
const exist = await ReservationModel.findOne({
  member_id,
  bookId,
});

if (exist) {
  return showResponse(
    false,
    "Reservation already exists",
    null,
    statusCodes.API_ERROR
  );
}

const formattedDate = moment()
  .format("dddd, YYYY MMMM DDDD, hh:mm A");

if (!formattedDate) {
  return showResponse(
    false,
    "Invalid date format. Use DD/MM/YYYY",
    null,
    statusCodes.VALIDATION_ERROR
  );
}
  const reservation = await ReservationModel.create({
    member_id,
    bookId,
    totalBook_reserved,
    book_isbn:book.isbn,
    member_joinStatus:member.joinStatus,
   member_name:member.name,
   reserved_date
  
  });

  return showResponse(
    true,
    "Reservation created successfully",
    reservation,
    statusCodes.SUCCESS
  );
},

getReservedBook: async (data: any) => {
  const { _id } = data;

  const reservation = await ReservationModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(_id)
      }
    },
    {
      $lookup: {
        from: "members",          
        localField: "member_id",  
        foreignField: "_id",      
        as: "member_details"
      }
    },
    {
      $unwind: "$member_details"
    }
  ]);

  if (!reservation.length) {
    return showResponse(
      false,
      "Reserved book not found",
      statusCodes.VALIDATION_ERROR
    );
  }

  return showResponse(
    true,
    "Reservation book fetched successfully",
    reservation[0],
    statusCodes.SUCCESS
  );
},
updatereservedbook: async (data: any) => {
  const { _id, book_name, totalBook_reserved } = data;

  if (!_id) {
    throw new Error("ID is required");
  }

  const updatedobj: any = {
    ...(book_name && { book_name }),
    ...(totalBook_reserved !== undefined && { totalBook_reserved }),
  };

  const update = await ReservationModel.findByIdAndUpdate(
    _id,
    updatedobj,
    { new: true }
  );

   if(!update){
       return showResponse(
    false,
    "reserved book not found",
    statusCodes.VALIDATION_ERROR
  );
   }
    return showResponse(
    true,
    "Reservation book updated successfully",
    update,
    statusCodes.SUCCESS
  );

},

deletereversedBook:async(data:any)=>{
  const {_id} = data;
  console.log(_id,"=================")
  const deleteresevedStatus = await ReservationModel.findByIdAndDelete(_id)
    if(!deleteresevedStatus){
       return showResponse(
        false,
    "Reservation book not found",
    statusCodes.SUCCESS
  );
}
   return showResponse(
    true,
    "Reservation book delete successfully",
    deleteresevedStatus,
    statusCodes.SUCCESS
  );
    }
  
}

export default revervationhandler