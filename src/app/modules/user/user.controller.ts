/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { UserServices } from "./user.service"
import  httpStatus  from "http-status"
import { JwtPayload } from "jsonwebtoken"


 
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body) 
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    })
})

 
const getAllUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const query = req.query 
    const result = await UserServices.getAllUsers(query as Record<string, string>)
    sendResponse(res, {
        success:true,
        statusCode: httpStatus.CREATED,
        message : "All Users Retrieved Successfully",
        data: result.data,
        meta : result.meta
    })
})

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result.user
    })
}) 


const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId); 
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
}) 
 

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const verifiedToken = req.user as JwtPayload;
  const payload = req.body; 
  const user = await UserServices.updateUser(userId, payload, verifiedToken); 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Updated Successfully",
    data: user,
  });
});



export const userControllers ={
    createUser,
    getAllUser,
    getSingleUser,
    getMe,
    updateUser
}