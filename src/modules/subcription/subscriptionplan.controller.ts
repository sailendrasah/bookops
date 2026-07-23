import { Body, Controller, Get, Post, Query, Route, Security, Tags } from "tsoa";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/interfaces.util";
import { tryCatchWrapper } from "../../utils/config.util";
import { showResponse } from "../../utils/response.util";
import statusCodes from "../../constants/statusCodes";
import handler from "../../modules/subcription/subscription.handler";
import { validateSubscriptionPlan } from "../../modules/subcription/subscription.validate";
import {validateSubscriptionPayment} from '../../modules/subcription/validateStripeSubscribePlan.validate'
@Tags("subscription")
@Route("/user/subscription")
export default class subscriptionController extends Controller {
  req: Request;
  res: Response;
  userId: string;

  constructor(req: Request, res: Response) {
    super();
    this.req = req;
    this.res = res;
    this.userId = req.body.user ? req.body.user.id : "";
  }

  @Security("Bearer")
  @Post("/subcription_plan")
  public async subcriptionplan(
    @Body()
    request: {
      name: string;
      stripe_price_id: string;
      trial_days: number;
      have_trial: boolean;
      amount: number;
      type: number;
    },
  ): Promise<ApiResponse> {
    const userRole = this.req.body.user?.ROLE;
    if (userRole !== "USER") {
      return showResponse(
        false,
        "Only user can add",
        null,
        statusCodes.API_ERROR,
      );
    }
    const validate = validateSubscriptionPlan(request);
    if (validate.error) {
      return showResponse(
        false,
        validate.error.message,
        null,
        statusCodes.VALIDATION_ERROR,
      );
    }
    const wrapperFun = tryCatchWrapper(handler.createSubscriptionPlan);
    return wrapperFun({ ...request, userId: this.userId });
  }
  @Security("Bearer")
  @Get("/get_subcription_plan")
  public async getsubcription_plan():Promise<ApiResponse>{
     const userRole = this.req.body.user?.ROLE;
    if (userRole !== "USER") {
      return showResponse(
        false,
        "Only user can add ",
        null,
        statusCodes.API_ERROR,
      );
    }
    const wrapperFun = tryCatchWrapper(handler.getPlan)
       return wrapperFun({userId: this.userId });
  }
   @Security("Bearer")
  @Get("/get_subcription_plan_detail")
  public async getsubcription_plan_detail(@Query() plan_id:string):Promise<ApiResponse>{
     const userRole = this.req.body.user?.ROLE;
    if (userRole !== "USER") {
      return showResponse(
        false,
        "Only user can see subscription detail ",
        null,
        statusCodes.API_ERROR,
      );
    }
    const wrapperFun = tryCatchWrapper(handler.getSubscriptionPlanDetail)
       return wrapperFun({plan_id,userId: this.userId });
  }
  @Security('Bearer')
    @Post("/stripe_subscribe_plan")
    public async stripeSubscribePlan(@Body() request: { token_id: string, plan_price_id: string }): Promise<ApiResponse> {

        const { token_id, plan_price_id } = request;

        const validate = validateSubscriptionPayment({ token_id, plan_price_id });
        if (validate.error) {
            return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
        }
        const wrappedFunc = tryCatchWrapper(handler.stripeSubscribePlan);
        return wrappedFunc({ token_id, plan_price_id }, this.userId); 
    }
    

}
