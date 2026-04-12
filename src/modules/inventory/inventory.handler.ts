import Inventory from "./inventory.modal";
import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import statusCodes from "../../constants/statusCodes";
import libarianAdBookModel from "../addBook/libarian.adBook.model";


const inventoryHandler ={
bookCondition:async(data:any):Promise<ApiResponse>=>{
const {userId,bookId,book_condition,note,book_status} = data;
 const book = await libarianAdBookModel.findOne({
  _id: bookId,
  isActive: { $ne: 2 }
}); 
    if(!book){
     return showResponse(
        false,
        "Book not exists.If u want to add something then please add book first ",
        statusCodes.API_ERROR,
      );
}
 const existing = await Inventory.findOne({ bookId });

    if (existing) {
      return showResponse(
        false,
        "Inventory already exists. Use update API",
        null,
        statusCodes.API_ERROR
      );
    }
const conditionbook = await Inventory.create({
    bookId,
    title: book.title,
  author: book.author,
  isbn: book.isbn,
  isActive:book.isActive,
    userId, 
    book_condition, 
    note,
    book_status
});

 return showResponse(
      true,
      "Book condition added successfully",
      conditionbook,
      statusCodes.SUCCESS,
    );
},
// -------------------------------------------------------------------------------------------------------------------------
getBookCondition:async():Promise<ApiResponse>=>{
  const getBook = await Inventory.find({isActive: { $ne: 2 }});
   if (!getBook) {
      return showResponse(
        false,
         "No inventory records found.",
        null,
        statusCodes.API_ERROR
      );
    }
 return showResponse(
    true,
    "Inventory fetched successfully",
    getBook,
    statusCodes.SUCCESS
  );
},
// -------------------------------------------------------------------------------------------------------------------------
updtateBookCondition:async(data:any):Promise<ApiResponse>=>{
  const {id,book_condition,note,book_status} = data;
  const updatedobj = {
    ...(book_condition&&{book_condition}),
    ...(note&&{note}),
    ...(book_status&&{book_status}),
  }
  const book = await Inventory.findOneAndUpdate(
  { _id: id, isActive: { $ne: 2 } },
  updatedobj,
  { new: true }
);
  if (!book) {
  return showResponse(
    false,
    "Inventory not found",
    null,
    statusCodes.NOT_FOUND
  );
}
   return showResponse(
      true,
      "Book condition updated successfully",
      book,
      statusCodes.SUCCESS,
    );
},
// -------------------------------------------------------------------------------------------------------------------------
deleteBook:async(data:any):Promise<ApiResponse>=>{

  const {_id} = data
  console.log(data,"=========")
const exist = await Inventory.findByIdAndUpdate(
  _id,
 {$set:{ isActive: 2} },
  { new: true }
);  if(!exist){
    return showResponse(
      false,
      "book not exisit"
    )
  }
  return showResponse(
    true,
    "Book soft  successfully",
    exist
  );
}
}
export default inventoryHandler;