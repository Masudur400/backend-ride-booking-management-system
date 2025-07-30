/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { UserServices } from "./user.service"
import  httpStatus  from "http-status"


 
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
    const result = await UserServices.gerAllUsers(query as Record<string, string>)
    sendResponse(res, {
        success:true,
        statusCode: httpStatus.CREATED,
        message : "All Users Retrieved Successfully",
        data: result.data,
        meta : result.meta
    })
})



export const userControllers ={
    createUser,
    getAllUser
}