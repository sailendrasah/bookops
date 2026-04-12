import { Request, Response } from "express";
import { ApiResponse } from "../../utils/interfaces.util";
import { tryCatchWrapper } from "../../utils/config.util";
import { Controller, Route, Get, Tags, Security } from "tsoa";
import dashboardHandler from "../../modules/dashboard/dashboard.handler";

@Tags("Dashboard")
@Route("/user/dashboard")
export default class DashboardController extends Controller {
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
   * API: Get Dashboard Data
   * Method: GET
   * URL: /user/dashboard
   */
  @Security("Bearer")
  @Get("/Dashboard")
  public async getDashboard(): Promise<ApiResponse> {
    const wrapperFun = tryCatchWrapper(dashboardHandler.getDashboard);

    return wrapperFun({
      userId: this.userId
    });
  }
}