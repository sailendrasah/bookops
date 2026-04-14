import { Request, Response } from 'express'
import { ApiResponse } from '../../utils/interfaces.util';
import { validateAddBook, validateUpdateBook } from './addbook.validation';
import { showResponse } from '../../utils/response.util';
import statusCodes from '../../constants/statusCodes';
import { tryCatchWrapper } from '../../utils/config.util';
import handler from '../addBook/libran.addbook.handler'
import { Controller, Route, Post, Tags, Security, Body, Put, Query, Delete, Get } from 'tsoa';

@Tags('Librarian Add Book')
@Route('/libran/addBook')
export default class LibrarianAddBook extends Controller {
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
 * API: Add Book
 * Method: POST
 * URL: /add_book
 *
 * Body:
 * {
 *   "title": "Book Name",
 *   "author": "Author Name",
 *   "isbn": "1234567890",
 *   "genre": "Fiction",        
 *   "totalCopies": 10,
 *   "shelfLocation": "A1"      
 * }
 */
  @Security('Bearer')
  @Post('/add_book')
  public async addBook(@Body() request: { title: string, author: string, isbn: number, genre: string, totalCopies: number, shelfLocation: string }): Promise<ApiResponse> {
    const userRole = this.req.body.user?.ROLE;
    if (userRole !== "LIBRARIAN") {
      return showResponse(false, "Only librarian can add books", null, statusCodes.API_ERROR)
    }

    const validate = validateAddBook(request)
    if (validate.error) {
      return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    }
    const wrapperfun = tryCatchWrapper(handler.addBook)
 return wrapperfun({
  ...request,
  userId: this.userId
});
  }
  

  /**
 * API: Update Book
 * Method: PUT
 * URL: /update_book
 *
 * Body:
 * {
 *   "book_id": "BOOK_ID",
 *   "title": "Book Name",          
 *   "author": "Author Name",       
 *   "isbn": "1234567890",          
 *   "genre": "Fiction",           
 *   "totalCopies": 10,            
 *   "availableCopies": 5,          
 *   "shelfLocation": "A1"          
 * }
 */


  @Security('Bearer')
  @Put("/update_book")
  public async updateBook(@Body() request:{book_id:string, title: string, author: string, isbn: number, genre: string, totalCopies: number, availableCopies?: number, shelfLocation: string}):Promise<ApiResponse>{
        const userRole = this.req.body.user?.ROLE;
      if (userRole !== "LIBRARIAN") {
      return showResponse(false, "Only librarian can add books", null, statusCodes.API_ERROR)
    }
      const validate = validateUpdateBook(request)
    if (validate.error) {
      return showResponse(false, validate.error.message, null, statusCodes.VALIDATION_ERROR)
    }
    const wrapperfun = tryCatchWrapper(handler.updateBook)
    return wrapperfun({ userId:this.userId,...request});
  }

/**
 * API: Get Books
 * Method: POST
 * URL: /get_books
 *
 * Query Params:
 * {
 *   "page": 1,
 *   "limit": 10,
 *   "author": "Author Name",
 *   "genre": "Genre Name",
 *   "availability": "available" // or "not_available"
 * }
 */


  @Security('Bearer')
  @Get("/get_books")
  public async getBook(@Query() page?: number,@Query() limit?: number,@Query() author?: string,@Query() genre?: string,@Query() availability?: string): Promise<ApiResponse> {
    const wrapperfun = tryCatchWrapper(handler.getBook)
    return wrapperfun({userId:this.userId,page,limit,author,genre,availability});
  }

  @Security('Bearer')
  @Delete("/delete_book")
  public async deleteBook(@Query() book_id:string){
     const wrapperfun = tryCatchWrapper(handler.softDeleteBook)
    return wrapperfun({userId:this.userId,book_id});
  }
}