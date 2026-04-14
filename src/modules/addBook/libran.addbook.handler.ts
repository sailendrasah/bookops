import Book from "./libarian.adBook.model";
import { showResponse } from "../../utils/response.util";
import statusCodes from "../../constants/statusCodes";
import { ApiResponse } from "../../utils/interfaces.util";
import mongoose from "mongoose";

const addBookHandler = {
  addBook: async (request: any): Promise<ApiResponse> => {
    const { title, author, isbn, genre, totalCopies, shelfLocation,userId } = request;

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return showResponse(
        false,
        "Book already exists",
        existingBook,
        statusCodes.API_ERROR,
      );
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      genre,
      totalCopies,
      availableCopies: totalCopies,
      shelfLocation,
      userId,
    });

    return showResponse(
      true,
      "Book added successfully",
      book,
      statusCodes.SUCCESS,
    );
  },
  // -------------------------------------------------------------------------------------------------

  updateBook: async (data: any): Promise<ApiResponse> => {
    const {
      title,
      author,
      isbn,
      genre,
      totalCopies,
      availableCopies,
      shelfLocation,
    } = data;

   const existingBook = await Book.findById(
  new mongoose.Types.ObjectId(data.book_id)
);
    console.log(existingBook,"=========")
    if (!existingBook) {
      return showResponse(false, "Book not found", null, statusCodes.API_ERROR);
    }

    if (isbn && isbn !== existingBook.isbn) {
      const isbnExists = await Book.findOne({ isbn });
      if (isbnExists) {
        return showResponse(
          false,
          "ISBN already exists for another book",
          null,
          statusCodes.API_ERROR,
        );
      }
    }

    const updatedObj: any = {
      ...(title && { title }),
      ...(author && { author }),
      ...(isbn && { isbn }),
      ...(genre && { genre }),
      ...(totalCopies && { totalCopies }),
      ...(availableCopies && { availableCopies }),
      ...(shelfLocation && { shelfLocation }),
    };
   const updatedBook = await Book.findOneAndUpdate(
  { _id: data.book_id, isActive: 1 }, 
  updatedObj,                        
  { new: true }                      
);
    return showResponse(
      true,
      "Book updated successfully",
      updatedBook,
      statusCodes.SUCCESS,
    );
  },
  // -------------------------------------------------------------------------------------
 getBook: async (data: any): Promise<ApiResponse> => {
  const { page = 1, limit =10, author, genre, availability } = data;
console.log(data,"============")
  const skip = (page - 1) * limit;
  const filterData: any = {isActive: { $ne: 2 }};

  if (author) {
    filterData.author = { $regex: author, $options: "i" };
  }

  if (genre) {
    filterData.genre = { $regex: genre, $options: "i" };
  }

  if (availability) {
    if (availability === "available") {
      filterData.availableCopies = { $gt: 0 };
    } else if (availability === "not_available") {
      filterData.availableCopies = { $eq: 0 };
    }
  }
  const books = await Book.aggregate([
    { $match: filterData },
    {
      $lookup:{
        from:"users",
        localField:"userId",
        foreignField:"_id",
        as:"userDetail"
      }
    },
    {$unwind:"$userDetail"},
    {
   $project: {
      title:1,
      author:1,
      isbn:1,
      genre:1,
      totalCopies:1,
      availableCopies:1,
      shelfLocation:1,
      isActive:1,

  userDetail: {
    Name: "$userDetail.Name",
    email: "$userDetail.email",
    Address: "$userDetail.Address",
    phone_number: "$userDetail.phone_number"
  }
}
},
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: Number(limit) }
  ]);

  return showResponse(
    true,
    " books fetched successfully",
    books,
    statusCodes.SUCCESS
  );
},
// ------------------------------------------------------------------------------------------
softDeleteBook: async(data:any):Promise<ApiResponse>=>{
  const softDelete = await Book.findByIdAndUpdate( data.book_id,
    {$set:{ isActive: 2} },
  );
   if (!softDelete) {
    return showResponse(false, "Book not found", null, statusCodes.API_ERROR);
  }

  return showResponse(
    true,
    "Book soft deleted successfully",
    softDelete,
    statusCodes.SUCCESS
  );
}
  }

  


export default addBookHandler;
