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
exports.DriverController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const driver_service_1 = require("./driver.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const driver_interface_1 = require("./driver.interface");
const user_model_1 = require("../user/user.model");
const createDriverPost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'user not found !');
    }
    const dbUser = yield user_model_1.User.findById(user.userId);
    if (!dbUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found!');
    }
    const payload = Object.assign(Object.assign({}, req.body), { driverId: user.userId, driverName: dbUser.name, driverEmail: user.email, postStatus: driver_interface_1.IDrivePostStatus.APPROVED });
    const result = yield driver_service_1.DriverService.createDriverPost(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Driver post created successfully",
        data: result,
    });
}));
const getAllDriverPosts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield driver_service_1.DriverService.getAllDriverPosts(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All driver posts retrieved",
        data: result.data,
        meta: result.meta,
    });
}));
const getMyDriverPosts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params;
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'user not found !');
    }
    const posts = yield driver_service_1.DriverService.getMyDriverPosts(user.userId, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "My driver posts retrieved",
        data: posts,
    });
}));
const updatePostStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { postStatus } = req.body;
    if (!postStatus) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Post status is required');
    }
    const updatedPost = yield driver_service_1.DriverService.updatePostStatus(id, postStatus);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Driver post status updated',
        data: updatedPost,
    });
}));
const deleteMyDriverPost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'user not found !');
    }
    const { id } = req.params;
    const deletedPost = yield driver_service_1.DriverService.deleteMyDriverPost(id, user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver post deleted successfully",
        data: deletedPost,
    });
}));
exports.DriverController = {
    createDriverPost,
    getAllDriverPosts,
    getMyDriverPosts,
    updatePostStatus,
    deleteMyDriverPost,
};
