import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { DriverService } from "./driver.service";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import AppError from "../../errorHandler/AppError";
import { IDrivePostStatus } from "./driver.interface";
import { User } from "../user/user.model"; 





const createDriverPost = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload; 
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'user not found !');
    }
    const dbUser = await User.findById(user.userId);
    if (!dbUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }
    const payload = {
        ...req.body,
        driverId: user.userId,
        driverName: dbUser.name,
        driverEmail: user.email,
        postStatus: IDrivePostStatus.APPROVED,
    };
    const result = await DriverService.createDriverPost(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Driver post created successfully",
        data: result,
    });
});



const getAllDriverPosts = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>;
    const result = await DriverService.getAllDriverPosts(query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All driver posts retrieved",
        data: result.data,
        meta: result.meta,
    });
});


const getMyDriverPosts = catchAsync(async (req: Request, res: Response) => {
    const query= req.params
    const user = req.user as JwtPayload;
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'user not found !');
    }
    const posts = await DriverService.getMyDriverPosts(user.userId,query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My driver posts retrieved",
        data: posts,
    });
}); 
 

 const updatePostStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { postStatus } = req.body; 
  if (!postStatus) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post status is required');
  } 
  const updatedPost = await DriverService.updatePostStatus(id, postStatus); 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver post status updated',
    data: updatedPost,
  });
});



const deleteMyDriverPost = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'user not found !');
    }
    const { id } = req.params;
    const deletedPost = await DriverService.deleteMyDriverPost(id, user.userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Driver post deleted successfully",
        data: deletedPost,
    });
});


export const DriverController = {
    createDriverPost,
    getAllDriverPosts,
    getMyDriverPosts,
    updatePostStatus,
    deleteMyDriverPost,
};