import {
  Controller,
  Get,
  Query,
  Route,
  Security,
  Tags
} from "tsoa";

import { Request, Response } from "express";
import { ApiResponse } from "../../utils/interfaces.util";
import { tryCatchWrapper } from "../../utils/config.util";
import handler from "../../modules/pdfgenerator/pdfgenerator.handler";

@Tags("Reports")
@Route("/libran/report")
export default class ReportController extends Controller {
  req: Request;
  res: Response;
  userId: string;

  constructor(req: Request, res: Response) {
    super();
    this.req = req;
    this.res = res;
    this.userId = req.body.user ? req.body.user.id : "";
  }

  /**
   * 📚 Borrow History Export
   * GET /libran/report/borrow-history?format=csv|pdf
   */
  @Security("Bearer")
  @Get("/borrow-history")
  public async exportBorrowHistory(
    @Query() format: string
  ): Promise<ApiResponse> {

    const wrapperFun = tryCatchWrapper(handler.exportBorrowHistory);

    return wrapperFun({
      format,
      userId: this.userId
    });
  }

  /**
   *  Member Activity Export
   * GET /libran/report/member-activity?format=csv|pdf
   */
  @Security("Bearer")
  @Get("/member-activity")
  public async exportMemberActivity(
    @Query() format: string
  ): Promise<ApiResponse> {

    const wrapperFun = tryCatchWrapper(handler.exportMemberActivity);

    return wrapperFun({
      format,
      userId: this.userId
    });
  }
}