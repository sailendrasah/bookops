import express, { Request, Response } from "express";
import { verifyTokenUser } from "../../middlewares/auth.middleware";
import { ApiResponse } from "../../utils/interfaces.util";
import { showOutput } from "../../utils/response.util";
import ReportController from "./pdfgenerator.controller";

const router = express.Router();

/**
 * 📚 Borrow History Report
 * GET /libran/report/borrow-history?format=csv|pdf
 */     
router.get(
  "/borrow-history",
  verifyTokenUser,
  async (req: Request | any, res: Response | any) => {
    const { format } = req.query;

    const controller = new ReportController(req, res);

    const result: ApiResponse = await controller.exportBorrowHistory(format);

    if (format === "pdf" && result.status && Buffer.isBuffer(result.data)) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="borrow-history.pdf"');
      return res.status(200).send(result.data);
    }

    if (format === "excel" && result.status && Buffer.isBuffer(result.data)) {
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", 'attachment; filename="borrow-history.xlsx"');
      return res.status(200).send(result.data);
    }

    return showOutput(res, result, result.code || 200);
  }
);

/**
 *  Member Activity Report
 * GET /libran/report/member-activity?format=csv|pdf
 */
router.get(
  "/member-activity",
  verifyTokenUser,
  async (req: Request | any, res: Response | any) => {
    const { format } = req.query;

    const controller = new ReportController(req, res);

    const result: ApiResponse = await controller.exportMemberActivity(format);

  

    return showOutput(res, result, result.code!);
  }
);

export default router;