import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    stripe_price_id:{
        type:String,
        required:true
    },
    trial_days:{
        type:Number,
        required:true
    },
    have_trial:{
        type:Boolean,
        default:false
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:Number,
        required:true
    }
},{timestamps:true});
 const Subscription =  mongoose.model("Subscription",subscriptionPlanSchema)
 export default Subscription;