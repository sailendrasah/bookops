import mongoose from "mongoose";
 const inventorySchema = new mongoose.Schema({
 bookId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Book" ,
},
    book_condition:{
        type:String,
          enum: ["NEW", "GOOD", "DAMAGED", "LOST"],
    },
     userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    title: {
    type: String
  },
 isActive: {
    type: Number,
  
  },
  author: {
    type: String
  },

  isbn: {
    type: String
  },
    note:{
        type:String,
    },
    book_status:{
         type: String,
    enum: ["AVAILABLE", "ISSUED"],
    default: ""
    }
 },{ timestamps: true })
 const Inventory =  mongoose.model("Inventory",inventorySchema);
 export default Inventory;