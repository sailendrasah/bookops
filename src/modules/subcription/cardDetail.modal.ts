import mongoose from "mongoose";

const cardDetailSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
      customer_id:{
        type:String,
    },
      card_id:{
        type:String,   
    }, 
     name:{
        type:String,
    }, 
     brand:{
        type:String,
    }, 
     month:{
        type:String,
    },
     year:{
        type:String,
    },
},{timestamps:true})

const Card = mongoose.model("Card",cardDetailSchema)

export default Card;