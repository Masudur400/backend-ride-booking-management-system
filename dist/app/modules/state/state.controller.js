"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const state_service_1 = require("./state.service");
const getDashboardStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield state_service_1.StatsService.getDashboardStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Admin dashboard stats fetched successfully",
        data: stats
    });
}));
const getUserStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userId = user.userId;
    const stats = yield state_service_1.StatsService.getUserStats(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User dashboard stats fetched successfully",
        data: stats
    });
}));
// Controller
const getRiderStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userId = user.userId;
    const stats = yield state_service_1.StatsService.getRiderStats(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Rider dashboard stats fetched successfully",
        data: stats
    });
}));
const getDriverStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userId = user.userId;
    const stats = yield state_service_1.StatsService.getDriverStats(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Driver dashboard stats fetched successfully",
        data: stats
    });
}));
exports.StatsController = {
    getDashboardStats,
    getUserStats,
    getRiderStats,
    getDriverStats
};
