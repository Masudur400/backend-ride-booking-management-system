import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHandler/AppError";
import httpStatus from 'http-status-codes'
import { Request, Response } from "express";
import { User } from "../user/user.model";
import { sendResponse } from "../../utils/sendResponse";
import { IRiderPostStatus } from "./ride.interface";
import { RiderService } from "./ride.service";




const createRiderPost = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'user not found !')
    }
    const dbUser = await User.findById(user.userId)
    if (!dbUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
    }
    const payload = {
        ...req.body,
        riderId: user.userId,
        riderName: dbUser.name,
        riderEmail: user.email,
        postStatus: IRiderPostStatus.APPROVED,
    }
    const result = await RiderService.createRiderPost(payload)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Rider post created successfully",
        data: result,
    })
})



const getAllRiderPosts = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>
    const result = await RiderService.getAllRiderPosts(query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All rider posts retrieved",
        data: result.data,
        meta: result.meta,
    })
})


const getMyRiderPosts = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>
    const user = req.user as JwtPayload
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'user not found !')
    }
    const posts = await RiderService.getMyRiderPosts(user.userId, query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My rider posts retrieved",
        data: posts,
    })
})


const updatePostStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const { postStatus } = req.body
    if (!postStatus) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Post status is required')
    }
    const updatedPost = await RiderService.updatePostStatus(id, postStatus)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'rider post status updated',
        data: updatedPost,
    })
})



const deleteMyRiderPost = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'user not found !')
    }
    const { id } = req.params
    const deletedPost = await RiderService.deleteMyRiderPost(id, user.userId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "rider post deleted successfully",
        data: deletedPost,
    })
})


export const RiderController = {
    createRiderPost,
    getAllRiderPosts,
    getMyRiderPosts,
    updatePostStatus,
    deleteMyRiderPost,
}