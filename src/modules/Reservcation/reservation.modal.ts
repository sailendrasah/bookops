import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    
    },


    author: {
      type: String,
    },

    isbn: {
      type: String,
    },
    member_name:{
        type:String
    },
    reserved_date:{
        type:Date,
    },

    reserved_status: {
      type: String,
      enum: ["RESERVED", "UNRESERVED"],
      default: "RESERVED",
    },

    totalBook_reserved: {
      type: Number,
     
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Reservation", reservationSchema);