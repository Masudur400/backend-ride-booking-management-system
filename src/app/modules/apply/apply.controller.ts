import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApplyService } from "./apply.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHandler/AppError";





export const createApplication = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
    }
    const userId = user.userId;
    const email = user.email;
    if (!userId || !email) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Incomplete user data in token');
    }
    const { want } = req.body;
    if (!want) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Role you want to apply for is required');
    }
    const result = await ApplyService.createApplication({ userId, want, email });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Application submitted successfully',
        data: result,
    });
});


const getMyApplication = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const result = await ApplyService.getMyApplication(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Your applications retrieved successfully",
        data: result,
    });
});



const getAllApplications = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await ApplyService.getAllApplications(query as Record<string, string>);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All applications retrieved",
        data: result.data,
        meta: result.meta
    });
});


const approveApplication = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ApplyService.approveApplication(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Application approved successfully",
        data: result,
    });
});


const cancelApplication = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const result = await ApplyService.cancelApplication(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Application cancelled successfully",
        data: result,
    });
});





export const ApplyController = {
    createApplication,
    getAllApplications,
    approveApplication,
    cancelApplication,
    getMyApplication
};