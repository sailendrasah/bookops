import statusCodes from "../../constants/statusCodes";
import { ApiResponse } from "../../utils/interfaces.util"
import { showResponse } from "../../utils/response.util";
import Member from "./member.modal";
import userAuthModel from "../UserAuth/user.auth.model";

const joinmember ={
join_member:async(data:any):Promise<ApiResponse>=>{
const { userId, memberShipType,joinStatus } = data;console.log(data,"========")
const exisit = await userAuthModel.findOne({_id:userId })
if(!exisit){
     return showResponse(
        false,
        "user not exists",
        statusCodes.API_ERROR,
      );
}
    const memberExist = await Member.findOne({  user_id: userId });

    if (memberExist) {
      return showResponse(
        false,
        "Member already exists",
        null,
        statusCodes.API_ERROR
      );
    }
const member = await Member.create({
    user_id:exisit._id,
    memberShipType,
    joinStatus,
    Address:exisit.Address,
    name:exisit.Name,
    email:exisit.email,
    status:exisit.status,
    ROLE:exisit.ROLE
})
 return showResponse(
      true,
      "Member joined successfully",
      member
    );
},
// ------------------------------------------------------------------------------
getmember:async(data:any):Promise<ApiResponse>=>{
  const {_id} = data;
  const exisist = await Member.findOne({_id,status: { $ne: 2 },joinStatus:{$ne:2}})
  if(!exisist){
    return showResponse(
        false,
        "member not exists.please join member",
        statusCodes.API_ERROR,
      );
  }
 return showResponse(
      true,
      "Member joined successfully",
      exisist
    );
},
// ------------------------------------------------------------------------------
updateMember:async(data:any):Promise<ApiResponse>=>{
  const {_id,name,Address,memberShipType} = data;
   const updatedObj: any = {
      ...(name && { name }),
      ...(memberShipType && { memberShipType }),
      ...(Address && { Address }),
    };
  const member = await Member.findOneAndUpdate({_id:_id,status:{$ne:2},joinStatus:{$ne:2}},
     updatedObj,                        
  { new: true }    
  )
  if (!member) {
  return showResponse(
    false,
    "Member not found or invalid ID",
    statusCodes.API_ERROR
  );
}
   return showResponse(
      true,
      "member updated successfully",
      member,
      statusCodes.SUCCESS,
    );
},
// ------------------------------------------------------------------------------
softDeleteMember:async(data:any):Promise<ApiResponse>=>{
  const {_id} = data;
  console.log(data,"--------=")
  const softDelete = await Member.findOneAndUpdate(
      { _id: _id }, 
    {
      $set: {
        joinStatus: 2 
      }
    },
    {
      new: true
    }
    
  )
    if (!softDelete) {
    return showResponse(
      false,
      "Member not found",
      null,
      statusCodes.API_ERROR
    );
  }
   return showResponse(
      true,
      "member sofDelted successfully",
      softDelete,
      statusCodes.SUCCESS,
    )
}
}
export default joinmember