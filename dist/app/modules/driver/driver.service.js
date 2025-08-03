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
exports.DriverService = void 0;
const driver_interface_1 = require("./driver.interface");
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_model_1 = require("./driver.model");
const queryBuilder_1 = require("../../utils/queryBuilder");
const driverConstant_1 = require("./driverConstant");
const createDriverPost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_model_1.Driver.create(payload);
    return result;
});
const getAllDriverPosts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(driver_model_1.Driver.find(), query);
    const driverData = queryBuilder
        .filter()
        .search(driverConstant_1.driverSearchableFields)
        .sort()
        .fields()
        .pagination();
    const [data, meta] = yield Promise.all([
        driverData.build(),
        driverData.getMeta()
    ]);
    return { meta, data };
});
const getMyDriverPosts = (driverId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = driver_model_1.Driver.find({ driverId });
    const queryBuilder = new queryBuilder_1.QueryBuilder(baseQuery, query);
    const driverDataQuery = queryBuilder
        .filter()
        .search(driverConstant_1.driverSearchableFields)
        .sort()
        .fields()
        .pagination();
    const [data, meta] = yield Promise.all([
        driverDataQuery.build(),
        driverDataQuery.getMeta(),
    ]);
    return { meta, data };
});
const updatePostStatus = (postId, postStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const validStatuses = Object.values(driver_interface_1.IDrivePostStatus);
    if (!validStatuses.includes(postStatus.toUpperCase())) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid post status');
    }
    const updatedPost = yield driver_model_1.Driver.findByIdAndUpdate(postId, { postStatus: postStatus.toUpperCase() }, { new: true });
    if (!updatedPost) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Post not found');
    }
    return updatedPost;
});
const deleteMyDriverPost = (postId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedPost = yield driver_model_1.Driver.findOneAndDelete({ _id: postId, driverId });
    if (!deletedPost) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Post not found");
    }
    return deletedPost;
});
exports.DriverService = {
    createDriverPost,
    getAllDriverPosts,
    getMyDriverPosts,
    deleteMyDriverPost,
    updatePostStatus,
};
