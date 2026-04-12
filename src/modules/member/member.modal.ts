import mongoose from "mongoose";
import { USER_STATUS } from "../../constants/workflow.constant";

const memberSchema =new  mongoose.Schema({
    user_id:{
type:mongoose.Types.ObjectId,
ref:"users"
    },
    name:{
        type:String
    },
    email:{
        type:String,
    },
                  status: { type: Number, default: USER_STATUS.ACTIVE },

ROLE: {
  type: String,
  enum: ["USER", "LIBRARIAN"],
},
joinStatus:{
    type:Number,
    enum:[1,2,3],
    default:1
},
    Address:{
        type:String
    },
    memberShipType:{
        type:String,
        enum:["BASIC","PREMIUM"]
    }
},{timestamps:true})

const Member =  mongoose.model("Member",memberSchema);
export default Member;