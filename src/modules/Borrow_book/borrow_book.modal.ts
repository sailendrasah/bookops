import mongoose from "mongoose";

const borrowingSchema = new mongoose.Schema({
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  issueDate: {
    type: String, // yyyymmdd
  },
  lastDate: {
    type: String, 
  },
  returnDate: {
    type: Number, 
  },
  status: {
    type: Boolean,
    default: true
  },
  Book_status: {
    type: String
  },
  renewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model("Borrow", borrowingSchema);