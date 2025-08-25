import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./state.service";
import { JwtPayload } from "jsonwebtoken";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getDashboardStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin dashboard stats fetched successfully",
        data: stats
    });
});

const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload
    const userId = user.userId;
    const stats = await StatsService.getUserStats(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User dashboard stats fetched successfully",
        data: stats
    });
});

// Controller
const getRiderStats = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const userId = user.userId;
  const stats = await StatsService.getRiderStats(userId);
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Rider dashboard stats fetched successfully",
      data: stats
  });
});

const getDriverStats = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload
    const userId = user.userId;
    const stats = await StatsService.getDriverStats(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Driver dashboard stats fetched successfully",
        data: stats
    });
});

export const StatsController = {
    getDashboardStats,
    getUserStats,
    getRiderStats,
    getDriverStats
};
