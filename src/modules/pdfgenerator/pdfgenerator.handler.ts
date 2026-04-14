import Borrow from "../../modules/Borrow_book/borrow_book.modal";
import { showResponse } from "../../utils/response.util";
import statusCodes from "../../constants/statusCodes";
import {generatePdf,excel} from "../../utils/puppteer.utils";


const handler = {

  // 📚 Borrow History
  exportBorrowHistory: async (request: any) => {
    const { format } = request;

    const borrows = await Borrow.aggregate([
      {
        $lookup: {
          from: "members",
          localField: "member_id",
          foreignField: "_id",
          as: "member"
        }
      },
      { $unwind: "$member" },
      {
        $lookup: {
          from: "books",
          localField: "book_id",
          foreignField: "_id",
          as: "book"
        }
      },
      { $unwind: "$book" },
      {
        $project: {
          memberName: "$member.name",
          memberEmail: "$member.email",
          bookTitle: "$book.title",
          issueDate: 1,
          returnDate: 1,
          status: 1
        }
      }
    ]);

    if (!borrows.length) {
      return showResponse(false, "No data found", null, statusCodes.NOT_FOUND);
    }

  

    if (format === "pdf") {
      const pdf = await generatePdf("Borrow Report", borrows);
      return showResponse(true, "PDF generated", pdf, statusCodes.SUCCESS);
    }
    if (format === "excel") {
      const excels = await excel(borrows);
      return showResponse(true, "Excel generated", excels, statusCodes.SUCCESS);
    }

    return showResponse(true, "Data fetched", borrows, statusCodes.SUCCESS);
  },


  exportMemberActivity: async (request: any) => {
    const { format } = request;

    const activity = await Borrow.aggregate([
      {
        $group: {
          _id: "$member_id",
          totalBorrowed: { $sum: 1 },
          totalFine: { $sum: "$fine" }
        }
      },
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "_id",
          as: "member"
        }
      },
      { $unwind: "$member" },
      {
        $project: {
          memberName: "$member.name",
          memberEmail: "$member.email",
          totalBorrowed: 1,
          totalFine: 1
        }
      }
    ]);

    if (!activity.length) {
      return showResponse(false, "No activity data", null, statusCodes.NOT_FOUND);
    }

    // PDF
    if (format === "pdf") {
      const pdf = await generatePdf("Member Activity Report", activity);
      return showResponse(true, "PDF generated", pdf, statusCodes.SUCCESS);
    }

    // Excel
    if (format === "excel") {
      const excels = await excel(activity);
      return showResponse(true, "Excel generated", excels, statusCodes.SUCCESS);
    }

    return showResponse(true, "Data fetched", activity, statusCodes.SUCCESS);
  }
};

export default handler;