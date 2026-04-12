import express ,{Request,Response} from 'express'
import { verifyTokenUser } from '../../middlewares/auth.middleware';
import DashboardController from './dashboard.controller';
import { ApiResponse } from '../../utils/interfaces.util';
import { showOutput } from '../../utils/response.util';
const router = express.Router();

router.get("/Dashboard",verifyTokenUser,async(req:Request|any,res:Response|any)=>{
    const controller = new DashboardController(req,res)
     const result: ApiResponse = await controller.getDashboard();
    
      return showOutput(res, result, result.code);
})

export default router;