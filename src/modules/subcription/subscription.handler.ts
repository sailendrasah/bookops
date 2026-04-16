import subscriptionPlanModel from "../../modules/subcription/subcriptionplan.modal";
import { showResponse } from "../../utils/response.util";
import statusCodes from "../../constants/statusCodes";
import subscriptionDetail from '../../modules/subcription/subscriptionPlanDetail.modal'
const subscriptionPlanHandler = {

  createSubscriptionPlan: async (data: any) => {
    
      const { name, stripe_price_id, trial_days, have_trial, amount, type } = data;

      const newPlan = new subscriptionPlanModel({
        name,
        stripe_price_id,
        trial_days,
        have_trial,
        amount,
        type
      });

      const savedPlan = await newPlan.save();

      return showResponse(
        true,
        "Subscription plan created successfully",
        savedPlan,
        statusCodes.SUCCESS
      );
  },
  getPlan:async()=>{
    const getPlan = await subscriptionPlanModel.find();
    
      return showResponse(
        true,
        "Subscription plan fetched successfully",
        getPlan,
        statusCodes.SUCCESS
      );
  },
  getSubscriptionPlanDetail:async(data:any)=>{
    const {user_id,plan_id} = data;
    const plan = await subscriptionPlanModel.findOne({_id:plan_id})
    if(!plan){
       return showResponse(
        true,
        "Subscription plan not found",
        statusCodes.SUCCESS
      );
    }
    const haveBuyPlan = await subscriptionDetail.countDocuments({user_id})
let subs_msg = "";

if (haveBuyPlan === 0 && plan?.have_trial) {
  subs_msg = `You will get ${plan.trial_days} days trial, and after that we will charge ₹${plan.amount} for ${plan.name}`;
} else {
  subs_msg = `You will be charged ₹${plan.amount} for ${plan.name}`;
}

      return showResponse(
   true,
  subs_msg,   
  plan,
  statusCodes.SUCCESS
  );
  },
  stripeSubscribePlan: async (data: any, userId: string) => {

  const { token_id, plan_price_id } = data;

  // 🔍 1. Check plan exists
  const plan = await subscriptionPlanModel.findOne({
    stripe_price_id: plan_price_id
  });

  if (!plan) {
    return showResponse(
      false,
      "Subscription plan not found",
      null,
      statusCodes.NOT_FOUND
    );
  }

  // 🔍 2. Check if already subscribed
  const existingSub = await subscriptionDetail.findOne({
    user_id: userId,
    plan_id: plan._id
  });

  if (existingSub) {
    return showResponse(
      false,
      "You have already subscribed to this plan",
      null,
      statusCodes.API_ERROR
    );
  }

  // 💳 3. Payment logic (mock / Stripe later)
  // 👉 Stripe integration can be added here

  // 🧾 4. Save subscription
  const newSubscription = new subscriptionDetail({
    user_id: userId,
    plan_id: plan._id,
    amount: plan.amount,
    status: "active",
    payment_token: token_id
  });

  const savedSub = await newSubscription.save();

  // 🎯 5. Response
  return showResponse(
    true,
    "Subscription successful",
    savedSub,
    statusCodes.SUCCESS
  );
}

};

export default subscriptionPlanHandler;