import { Body, Controller, Delete, Get, Post, Put, Query, Route, Security, Tags } from "tsoa";
import { Request, Response } from 'express'
import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import statusCodes from "../../constants/statusCodes";
import { validatemember, validateUpdateMember } from "./member.validation";
import { tryCatchWrapper } from "../../utils/config.util";
import handler from './member.handler'

@Tags('join member')
@Route('/libran/join_member')
export default class joinmember extends Controller {
  req: Request;
  res: Response;
  userId: string;

  constructor(req: Request, res: Response) {
    super();
    this.req = req;
    this.res = res;
    this.userId = req.body.user ? req.body.user.id : '';
  }

/** 
 * API: Join Member
 * Method: POST
 * URL: /join_member
 * 
 * Description:
 * Logged-in user can join membership (BASIC or PREMIUM).
 * Only users with role "USER" are allowed.
 
 *   "memberShipType": "BASIC" | "PREMIUM"
  */

@Security("Bearer")
@Post('/join_member')
public async joinMember(@Body() request:{memberShipType:string}):Promise<ApiResponse>{
     const userRole = this.req.body.user?.ROLE;
    if (userRole !== "USER") {
      return showResponse(false, "Only user can add ", null, statusCodes.API_ERROR)
    }
    const validate = validatemember(request);
     if(validate.error){
     return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    }
    const wrapperFun = tryCatchWrapper(handler.join_member)
            return wrapperFun({...request,userId:this.userId}); 
}
@Security('Bearer')
@Get("/get_member")
public async getMember(@Query()  _id:string):Promise<ApiResponse>{
   const wrapperFun = tryCatchWrapper(handler.getmember)
            return wrapperFun({_id,userId:this.userId});
}

@Security("Bearer")
@Put("/update_member")
public async updatemember(@Body() request:{_id:string,name:string,Address:string,memberShipType:string}):Promise<ApiResponse>{
  const validate = validateUpdateMember(request)
  if(validate.error){
      return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
  }
  const wrapperFun = tryCatchWrapper(handler.updateMember)
  return wrapperFun({...request,userId:this.userId})
}


@Security("Bearer")
@Delete("/soft_delete")
public async softDelete(@Body() request:{_id:string}):Promise<ApiResponse>{
  const validate = validateUpdateMember(request)
  if(validate.error){
      return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
  }
  const wrapperFun = tryCatchWrapper(handler.softDeleteMember)
  return wrapperFun({...request,userId:this.userId})
}

}