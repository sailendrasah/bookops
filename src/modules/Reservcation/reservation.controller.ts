import { Body, Controller, Delete, Get, Post, Put, Query, Route, Security, Tags } from "tsoa";
import { Request, Response } from 'express'
import { ApiResponse } from "../../utils/interfaces.util";
import { showResponse } from "../../utils/response.util";
import statusCodes from "../../constants/statusCodes";
import { validateReservation } from "./reservation.validation";
import { tryCatchWrapper } from "../../utils/config.util";
import handlers from '../../modules/Reservcation/reservation.handlers'

@Tags('reservation Book')
@Route('/reservation')
export default class ReservationController extends Controller {
  req: Request;
  res: Response;
  userId: string;

  constructor(req: Request, res: Response) {
    super();
    this.req = req;
    this.res = res;
    this.userId = req.body.user ? req.body.user.id : '';
  }
  @Security('Bearer')
  @Post('/create_reservation')
public async createReservation(@Body() request:{member_id:string, bookId:string, totalBook_reserved:number ,reserved_date:Date}):Promise<ApiResponse>{
 const userRole = this.req.body.user?.ROLE;
    if (userRole !== "USER") {
      return showResponse(false, "Only user can reserved books", null, statusCodes.API_ERROR)
    }
    const validate = validateReservation(request)
      if(validate.error){
     return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    }
    const wrapperFun = tryCatchWrapper(handlers.createReservation)
    return wrapperFun({...request,userId:this.userId});
}

 @Security('Bearer')
  @Get('/get_reservation_book')
public async getreservedBook(@Query() _id:string):Promise<ApiResponse>{
     const wrapperFun = tryCatchWrapper(handlers.getReservedBook)
    return wrapperFun({_id,userId:this.userId});
}

@Security('Bearer')
@Put("/update_reservation_book")
public async updatereservedBook(@Body() request:{_id:string,book_name:string,totalBook_reserved:number}):Promise<ApiResponse>{
   const userRole = this.req.body.user?.ROLE;
    if (userRole !== "USER") {
      return showResponse(false, "Only user can reserved books", null, statusCodes.API_ERROR)
    }
     const wrapperFun = tryCatchWrapper(handlers.updatereservedbook)
    return wrapperFun({...request,userId:this.userId});
}


@Security('Bearer')
@Delete("/delete_reservation_book")
public async DeletereservedBook(@Body() request:{_id:string}):Promise<ApiResponse>{
   const userRole = this.req.body.user?.ROLE;
    if (userRole !== "USER") {
      return showResponse(false, "Only user can reserved books", null, statusCodes.API_ERROR)
    }
     const wrapperFun = tryCatchWrapper(handlers.deletereversedBook)
    return wrapperFun({...request,userId:this.userId});
}

}