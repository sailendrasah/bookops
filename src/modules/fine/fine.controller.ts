import {  Request, Response } from 'express';
import { ApiResponse } from '../../utils/interfaces.util';
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes';
import { tryCatchWrapper } from '../../utils/config.util';
import handlers from '../../modules/fine/fine.handler'
import  {validateFine}  from '../../modules/fine/fine.validation';
import { Controller, Route, Post, Tags, Security, Body, Put, Get, Query, Delete, } from 'tsoa';

@Tags('fine Book')
@Route('/user/fine')
export default class fineController extends Controller {
  req: Request;
  res: Response;
  userId: string;

  constructor(req: Request, res: Response) {
    super();
    this.req = req;
    this.res = res;
    this.userId = req.body.user ? req.body.user.id : '';
  }

  @Security("Bearer")
  @Post("/add_fine")
  public async addFine(@Body() request :{member_id:string,borrowId:string,book_id:string,returnDate:string,isPaid:number ,paidDate:string,isFineCancel:number}):Promise<ApiResponse>{
        const userRole = this.req.body.user?.ROLE;
       if (userRole !== "LIBRARIAN") {
      return showResponse(false, "Only librarian can add fine", null, statusCodes.API_ERROR)
    }
const validate = validateFine(request)
  if (validate.error) {
      return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    }
    const wrapperfun = tryCatchWrapper(handlers.addFine)
 return wrapperfun({
  ...request,
  userId: this.userId
});
  }

  @Security("Bearer")
  @Put("/update_fine")
  public async updateFine(@Body() request:{borrowId:string, returnDate:string, isPaid:number, isFineCancel:number,paidDate:string}):Promise<ApiResponse>{
     const userRole = this.req.body.user?.ROLE;
       if (userRole !== "LIBRARIAN") {
      return showResponse(false, "Only librarian can add fine", null, statusCodes.API_ERROR)
    }
const validate = validateFine(request)
  if (validate.error) {
      return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    }
    const wrapperfun = tryCatchWrapper(handlers.updateFine)
 return wrapperfun({
  ...request,
  userId: this.userId
});
  }

  
  @Security("Bearer")
  @Get("/get_fine")
  public async getFine(@Query() _id:string):Promise<ApiResponse>{
     const userRole = this.req.body.user?.ROLE;
       if (userRole !== "LIBRARIAN") {
      return showResponse(false, "Only librarian can add fine", null, statusCodes.API_ERROR)
    }

    const wrapperfun = tryCatchWrapper(handlers.getfine)
 return wrapperfun({
  _id,
  userId: this.userId
});
  }

  
  @Security("Bearer")
  @Delete("/delete_fine")
  public async deleteFine(@Body() request:{_id:string}):Promise<ApiResponse>{
     const userRole = this.req.body.user?.ROLE;
       if (userRole !== "LIBRARIAN") {
      return showResponse(false, "Only librarian can add fine", null, statusCodes.API_ERROR)
    }

    const wrapperfun = tryCatchWrapper(handlers.delete)
 return wrapperfun({
  ...request,
  userId: this.userId
});
  }

}