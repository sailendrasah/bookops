import { ApiResponse } from "../../utils/interfaces.util";
import Book from '../../modules/addBook/libarian.adBook.model'
import Member from "../../modules/member/member.modal";
import Borrow from '../../modules/Borrow_book/borrow_book.modal'
import Fine from "../../modules/fine/fine.modal";
import { showResponse } from "../../utils/response.util";
import statusCodes from "../../constants/statusCodes";

const dashboardHandler = {

  getDashboard: async (): Promise<ApiResponse> => {

    const totalBooks = await Book.countDocuments({ isActive: 1 });

    // 2. Total Members
    const totalMembers = await Member.countDocuments({ status: 1 });

    const activeBorrowings = await Borrow.countDocuments({
      status: true,
    });

    // 5. Total Fine Collected
    const fineData = await Fine.aggregate([
      {
        $match: {
          isPaid: 1,        
        }
      },
      {
        $group: {
          _id: null,
          totalFine: { $sum: "$fineAmount" }
        }
      }
    ]);

    const totalFineCollected = fineData.length ? fineData[0].totalFine : 0;

    return showResponse(
      true,
      "Dashboard data fetched",
      {
        totalBooks,
        totalMembers,
        activeBorrowings,
        totalFineCollected
      },
      statusCodes.SUCCESS
    );
  }

};
export default dashboardHandler