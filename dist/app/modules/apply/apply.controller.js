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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyController = exports.createApplication = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const apply_service_1 = require("./apply.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
exports.createApplication = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Unauthorized access');
    }
    const userId = user.userId;
    const email = user.email;
    if (!userId || !email) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Incomplete user data in token');
    }
    const { want } = req.body;
    if (!want) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Role you want to apply for is required');
    }
    const result = yield apply_service_1.ApplyService.createApplication({ userId, want, email });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Application submitted successfully',
        data: result,
    });
}));
const getMyApplication = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const result = yield apply_service_1.ApplyService.getMyApplication(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Your applications retrieved successfully",
        data: result,
    });
}));
const getAllApplications = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield apply_service_1.ApplyService.getAllApplications(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All applications retrieved",
        data: result.data,
        meta: result.meta
    });
}));
const approveApplication = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield apply_service_1.ApplyService.approveApplication(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Application approved successfully",
        data: result,
    });
}));
const cancelApplication = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const result = yield apply_service_1.ApplyService.cancelApplication(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Application cancelled successfully",
        data: result,
    });
}));
exports.ApplyController = {
    createApplication: exports.createApplication,
    getAllApplications,
    approveApplication,
    cancelApplication,
    getMyApplication
};
