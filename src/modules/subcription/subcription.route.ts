import express, { Request, Response } from "express";
import { verifyTokenUser } from "../../middlewares/auth.middleware";
import { ApiResponse } from "../../utils/interfaces.util";
import { showOutput } from "../../utils/response.util";
import subscriptionController from "../../modules/subcription/subscriptionplan.controller";
  

const router = express.Router();
 

router.post("/subcription_plan",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
    const {name,stripe_price_id,trial_days,have_trial,amount,type} = req.body;
    const controller =  new subscriptionController(req,res)
    const result:ApiResponse = await controller.subcriptionplan({name,stripe_price_id,trial_days,have_trial,amount,type});
         return showOutput(res, result, result.code) 
})

router.get("/get_subcription_plan",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
     const controller =  new subscriptionController(req,res)
    const result:ApiResponse = await controller.getsubcription_plan();
         return showOutput(res, result, result.code||500)
})


router.get("/get_subcription_plan_detail",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
    const {plan_id} = req.query;
     const controller =  new subscriptionController(req,res)
    const result:ApiResponse = await controller.getsubcription_plan_detail(plan_id);
         return showOutput(res, result, result.code)
})

 router.post('/stripe_subscribe_plan', verifyTokenUser, async (req: Request | any, res: Response) => {
    const { token_id, plan_price_id } = req.body;
    const controller = new subscriptionController(req, res)
    const result: ApiResponse = await controller.stripeSubscribePlan({token_id,plan_price_id})
    return showOutput(res, result, result.code)
})
export default router;