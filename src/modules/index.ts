import express from 'express';
const Route = express.Router();

//admin routes
// import adminAuthRoutes from '../modules/AdminAuth/admin.auth.route'
// import adminCommonRoutes from '../modules/AdminCommon/admin.common.route'
// import adminUserRoutes from '../modules/AdminUser/admin.user.route'
// import adminContactUsRoutes from '../modules/AdminContactus/admin.contactus.route'
import addBook from '../modules/addBook/libran.addBook.route'
import bookCondition from '../modules/inventory/inventory.route'
import member from './member/member.route'
import reservation from '../modules/Reservcation/reservation.route'
import Borrow from '../modules/Borrow_book/borrow_book.route'
import Addfine from '../modules/fine/fine.route'
import DashBoard from '../modules/dashboard/dashboard.route'
import pdf from '../modules/pdfgenerator/pdfgenerator.route'
import subscription from '../modules/subcription/subcription.route'
//user and admin all usertype common routes
// import commonRoutes from '../modules/Common/common.route'

//user routes
import userAuthRoutes from '../modules/UserAuth/user.auth.route'
// import userCommonRoutes from '../modules/UserCommon/user.common.route'



// *********assign order of routes for swagger in last to show on first **********


//admin routes
// Route.use('/admin/common', adminCommonRoutes);
// Route.use('/admin/user', adminUserRoutes);
// Route.use('/admin/auth', adminAuthRoutes);
// Route.use('/admin/contactus', adminContactUsRoutes);

//user routes
Route.use("/user/dashboard",DashBoard)
Route.use('/user/auth', userAuthRoutes);
// Route.use('/user/common', userCommonRoutes);
Route.use('/libran/addBook', addBook);
Route.use('/libran/inventory', bookCondition);
Route.use('/libran/join_member', member);
Route.use('/reservation', reservation);
Route.use('/user/borrow',Borrow)
Route.use('/user/fine',Addfine)
Route.use('/libran/report',pdf)
Route.use('/user/subscription',subscription)

//user and admin all usertype common routes
// Route.use('/common', commonRoutes);

export default Route;