import mongoose from "mongoose";

const fineSchema =new mongoose.Schema ({
    borrow_id:{
  type: mongoose.Schema.Types.ObjectId,
    },
     member_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      book_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      fineAmount:{
        type:Number
      },
      returnDate:{
        type:String
      },
      isPaid:{
        type:Number,
        enum:[1,2,3]
      },
      paidDate:{
        type:String
      },
      isFineCancel:{
        type:Number,
        enum:[1,2,3]
      }
},{timestamps:true})
const Fine = mongoose.model("Fine",fineSchema)

export default Fine;