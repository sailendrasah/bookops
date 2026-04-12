import {  Request, Response } from 'express';
import { ApiResponse } from '../../utils/interfaces.util';
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes';
import { tryCatchWrapper } from '../../utils/config.util';
import  {validateBorrow}  from '../../modules/Borrow_book/borrow.validation';
import { Controller, Route, Post, Tags, Security, Body, Get, Query, Put, Delete } from 'tsoa';
import handler from '../../modules/Borrow_book/borrow_book.handller'

@Tags('Borrow Book')
@Route('/user/borrow')
export default class BorrowController extends Controller {
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
   * API: Add Borrow (Issue Book)
   * Method: POST
   * URL: /add_borrow
   *
   * Body:
   * {
   *   "member_id": "ObjectId",
   *   "book_id": "ObjectId",
   *   "issueDate": 20260411,
   *   "lastDate": 20260420
   * }
   */
  @Security('Bearer')
  @Post('/add_borrow')
  public async addBorrow(
    @Body() request: {
      member_id: string;
      book_id: string;
      issueDate: string;
      lastDate: string;
    }
  ): Promise<ApiResponse> {

    const userRole = this.req.body.user?.ROLE;

    if (userRole !== "USER") {
      return showResponse(
        false,
        "Only user can issue books",
        null,
        statusCodes.API_ERROR
      );
    }

    const validate = validateBorrow(request);
    if (validate.error) {
      return showResponse(
        false,
        validate.error.message,
        null,
        statusCodes.VALIDATION_ERROR
      );
    }

    const wrapperfun = tryCatchWrapper(handler.addBorrow);

    return wrapperfun({
      ...request,
      userId: this.userId
    });
  }

  @Security("Bearer")
  @Get("/get_borrow_book")
  public async getBorrowBook(@Query() _id:string):Promise<ApiResponse>{
    
    const wrapperfun = tryCatchWrapper(handler.getBorrowedBook)
     return wrapperfun({
      _id,
      userId: this.userId
    });
  }

  @Security('Bearer')
  @Put("/update_borrow_book")
  public async update_borrow_book(@Body() request:{_id:string, lastDate:string, status:boolean, renewCount:number,issueDate:string}):Promise<ApiResponse>{
      const userRole = this.req.body.user?.ROLE;

    if (userRole !== "USER") {
      return showResponse(
        false,
        "Only user can issue books",
        null,
        statusCodes.API_ERROR
      );
    }
    const validate = validateBorrow(request)
     if (validate.error) {
      return showResponse(
        false,
        validate.error.message,
        null,
        statusCodes.VALIDATION_ERROR
      );
    }
    const wrapperFun = tryCatchWrapper(handler.updateBorrow)
    return wrapperFun({
      ...request,
      userId: this.userId
    });
  }

  @Security('Bearer')
  @Delete("/delete_borrow_book")
  public async delete_borrow_book(@Body() request:{_id:string}):Promise<ApiResponse>{
 const userRole = this.req.body.user?.ROLE;

    if (userRole !== "USER") {
      return showResponse(
        false,
        "Only user can issue books",
        null,
        statusCodes.API_ERROR
      );
    }
    const validate = validateBorrow(request)
     if (validate.error) {
      return showResponse(
        false,
        validate.error.message,
        null,
        statusCodes.VALIDATION_ERROR
      );
    }
    const wrapperFun = tryCatchWrapper(handler.delete)
    return wrapperFun({
      ...request,
      userId: this.userId
    });
  }
}