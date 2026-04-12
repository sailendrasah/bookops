import { Request,Response} from 'express'
import { Body, Controller, Delete, Get, Post, Put, Route, Security, Tags } from 'tsoa';
import { ApiResponse } from '../../utils/interfaces.util';
import { validateInventory } from './inventory.validation';
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes';
import { tryCatchWrapper } from '../../utils/config.util';
import handler from './inventory.handler'
@Tags('Library Book management')
@Route('/libran/inventory')
export default class inventory_bookCondition extends Controller {
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
 * API: Add Book Condition
 * POST /libran/inventory/book_condition
 *
 * Body:
 * { bookId, book_condition (NEW|GOOD|DAMAGED|LOST), note? }
 *
 * Access: Librarian only
 */

@Security("Bearer")
  @Post("/book_condition")
  public async bookCondition(@Body() request:{bookId:string,book_condition:string,note:string,book_status:string}):Promise<ApiResponse>{
     const userRole = this.req.body.user?.ROLE;
     if (userRole !== "LIBRARIAN") {
      return showResponse(false, "Only librarian can add books", null, statusCodes.API_ERROR)
    }
    const validate = validateInventory(request)
    if(validate.error){
              return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    }
    const wrapperFun = tryCatchWrapper(handler.bookCondition)
     return wrapperFun({
  ...request,
  userId: this.userId
});
  }

  /**
 * API: Get All Book Conditions (Inventory)
 * GET /libran/inventory/getAll_book_condition
 *
 * Access: Librarian only
 */


@Security("Bearer")
@Get("/getAll_book_condition")
public async getBookCondition(): Promise<ApiResponse> {

  const userRole = this.req.body.user?.ROLE;

  if (userRole !== "LIBRARIAN") {
    return showResponse(
      false,
      "Only librarian can access inventory",
      null,
      statusCodes.API_ERROR
    );
  }

  const wrapperFun = tryCatchWrapper(handler.getBookCondition);

  return wrapperFun({userId:this.userId});
}
/**
 * API: Update Book Condition
 *
 * Body:
 * {
 *   id: string, // inventory record ID
 *   book_condition?: "NEW" | "GOOD" | "DAMAGED" | "LOST",
 *   note?: string,
 *   book_status?: "AVAILABLE" | "ISSUED"
 * }
 *
 * Access: Librarian only
 */

@Security("Bearer")
@Put("/update_book_condition")
public async updateBookCondition(@Body() request:{id:string,book_condition:string,note:string,book_status:string}):Promise<ApiResponse>{
  
  const userRole = this.req.body.user?.ROLE;

  if (userRole !== "LIBRARIAN") {
    return showResponse(
      false,
      "Only librarian can access inventory",
      null,
      statusCodes.API_ERROR
    );
  }
  const validate = validateInventory(request)
     if(validate.error){
     return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    }
    const wrapperFun = tryCatchWrapper(handler.updtateBookCondition)
    return wrapperFun({...request,userId:this.userId})
}

/**
 * API: Soft Delete Book Condition
 * Method: DELETE
 * URL: /soft_delete_book_condition
 *  "bookId": "BOOK_ID"
 */

@Security("Bearer")
@Delete("/soft_delete_book_condition")
public async deleteBook(@Body() request:{_id:string}):Promise<ApiResponse>{
  const userRole = this.req.body.user?.ROLE;

  if (userRole !== "LIBRARIAN") {
    return showResponse(
      false,
      "Only librarian can access inventory",
      null,
      statusCodes.API_ERROR
    );
  }
  const wrapperfun = tryCatchWrapper(handler.deleteBook)
  return wrapperfun({_id:request._id,userId:this.userId})
}
  }
