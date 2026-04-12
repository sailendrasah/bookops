import mongoose from 'mongoose'

const addBookSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "users"
},

  author: {
    type: String,
    trim: true
  },

  isbn: {
    type: String,
    unique: true,
    trim: true
  },

  genre: {
    type: String,
    trim: true
  },

  totalCopies: {
    type: Number,
    
  },

  availableCopies: {
    type: Number,
    
  },

  shelfLocation: {
    type: String,
    trim: true
  },

  isActive: {
    type: Number,
   enum:[1,2,3],
   default:1
  }

}, { timestamps: true });

export default mongoose.model("Book", addBookSchema);