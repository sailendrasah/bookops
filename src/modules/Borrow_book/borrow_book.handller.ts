import moment from "moment";
import { ApiResponse } from "../../utils/interfaces.util";
import Book from '../../modules/addBook/libarian.adBook.model'
import { showResponse } from "../../utils/response.util";
import statusCodes from "../../constants/statusCodes";
import borrow_bookModal from "./borrow_book.modal";
import mongoose from "mongoose";

const borrowHandler = {

  addBorrow: async (request: any): Promise<ApiResponse> => {
    const { member_id, book_id, issueDate, lastDate, userId } = request;

    const book = await Book.findById(book_id);

    if (!book) {
      return showResponse(false, "Book not found", null, statusCodes.API_ERROR);
    }
if ((book.availableCopies ?? 0) <= 0) {
  return showResponse(false, "Book not available", null, statusCodes.API_ERROR);
}

    const existingBorrow = await borrow_bookModal.findOne({
      member_id,
      book_id,
      status: true
    });

    if (existingBorrow) {
      return showResponse(
        false,
        "Book already issued to this member",
        existingBorrow,
        statusCodes.API_ERROR
      );
    }

    const formattedIssueDate = moment(issueDate).format("YYYY-DD-MMM");
    const formattedLastDate = moment(lastDate).format("YYYY-DD-MMM");

    const borrow = await borrow_bookModal.create({
      member_id,
      book_id,
      issueDate: formattedIssueDate,
      lastDate: formattedLastDate,
      status: true,
      userId
    });

  book.availableCopies = (book.availableCopies ?? 0) - 1;
    await book.save();

    return showResponse(
      true,
      "Book issued successfully",
      borrow,
      statusCodes.SUCCESS
    );
  },
  getBorrowedBook:async(data:any):Promise<ApiResponse>=>{
    const{_id} = data;
    if(!_id){
       return showResponse(false, "please provide borrowId", null, statusCodes.API_ERROR);
    }
   const borrow = await borrow_bookModal.aggregate([
  {
    $match: {
      _id: new mongoose.Types.ObjectId(_id)
    }
  },
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "_id",
      as: "book"
    }
  },
  {
    $unwind: {
      path: "$book",
      preserveNullAndEmptyArrays: true
    }
  },

  
  {
    $lookup: {
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
    $project: {
      _id: 1,
      issueDate: 1,
      lastDate: 1,
      status: 1,
      renewCount:1,

      book: {
        title: "$book.title",
        author: "$book.author",
        isbn: "$book.isbn",
        genre: "$book.genre",
        totalCopies: "$book.totalCopies",
        availableCopies: "$book.availableCopies"
      },

    
      member: {
        name: "$member.name",
        email: "$member.email",
        joinStatus: "$member.joinStatus",
        status:"$member.status"
      }
    }
  }
]);
    if(!borrow){
      return showResponse(
      false,
      "Book borrow not found",
      borrow,
      statusCodes.SUCCESS
    );
    }
    return showResponse(
      true,
      "Book borrow fetch successfully",
      borrow,
      statusCodes.SUCCESS
    );
  },
  updateBorrow: async (request: any): Promise<ApiResponse> => {
  const { _id, lastDate, status, renewCount,issueDate } = request;

  if (!_id) {
    return showResponse(
      false,
      "borrow id (_id) is required",
      null,
      statusCodes.API_ERROR
    );
  }

  const borrow = await borrow_bookModal.findById(_id);

  if (!borrow) {
    return showResponse(
      false,
      "Borrow record not found",
      null,
      statusCodes.API_ERROR
    );
  }

  if (lastDate) {
    borrow.lastDate = moment(lastDate).format("YYYY-DD-MMM");
  }

  if (issueDate) {
    borrow.issueDate = moment(lastDate).format("YYYY-DD-MMM");
  }

  if (status !== undefined) {
    borrow.status = status;
  }

  if (renewCount !== undefined) {
    borrow.renewCount = renewCount;
  }

  await borrow.save();

  return showResponse(
    true,
    "Borrow record updated successfully",
    borrow,
    statusCodes.SUCCESS
  );
},
delete:async(data:any):Promise<ApiResponse>=>{
  const{_id} = data;
  if (!_id) {
    return showResponse(
      false,
      "borrow id (_id) is required",
      null,
      statusCodes.API_ERROR
    );
  }
  const deleteBorrowBook = await borrow_bookModal.findByIdAndDelete(_id)
  
  return showResponse(
    true,
    "Borrow record delete successfully",
    deleteBorrowBook,
    statusCodes.SUCCESS
  );
}
}
export default borrowHandler