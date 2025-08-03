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
exports.ApplyService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const apply_interface_1 = require("./apply.interface");
const apply_model_1 = require("./apply.model");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const queryBuilder_1 = require("../../utils/queryBuilder");
const applyConstant_1 = require("./applyConstant");
const createApplication = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, want, email } = payload;
    const isApplyExist = yield apply_model_1.Apply.findOne({ userId });
    if (isApplyExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'You have already applied');
    }
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    if (isUserExist.role !== user_interface_1.Role.USER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Only users can apply');
    }
    const application = yield apply_model_1.Apply.create({
        userId,
        want,
        email
    });
    return application;
});
const getMyApplication = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield apply_model_1.Apply.find({ userId });
    if (!application) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Application not found");
    }
    return application;
});
const cancelApplication = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield apply_model_1.Apply.findOne({ userId });
    if (!application) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Application not found");
    }
    if (application.isApproved) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You cannot cancel an approved application");
    }
    const result = yield apply_model_1.Apply.findOneAndDelete({ userId });
    return result;
});
const getAllApplications = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(apply_model_1.Apply.find(), query);
    const applicationData = queryBuilder
        .filter()
        .search(applyConstant_1.applySearchableFields)
        .sort()
        .fields()
        .pagination();
    const [rawData, meta] = yield Promise.all([
        applicationData.build(),
        queryBuilder.getMeta(),
    ]);
    const userIds = rawData.map(app => app.userId.toString());
    const users = yield user_model_1.User.find({ _id: { $in: userIds } }, { name: 1, email: 1 });
    const userMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = { name: user.name, email: user.email };
        return acc;
    }, {});
    const formattedData = rawData.map(app => (Object.assign(Object.assign({}, app.toObject()), { userId: app.userId.toString(), userData: userMap[app.userId.toString()] || null })));
    return { data: formattedData, meta };
});
const approveApplication = (applyId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield apply_model_1.Apply.findById(applyId);
    if (!application) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Application not found");
    }
    if (application.isApproved) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Application already approved");
    }
    const user = yield user_model_1.User.findById(application.userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const requestedRole = application.want;
    const requestedRoleAsRole = requestedRole === apply_interface_1.IWant.DRIVER ? user_interface_1.Role.DRIVER : user_interface_1.Role.RIDER;
    if (user.role === requestedRoleAsRole) {
        yield apply_model_1.Apply.findByIdAndDelete(application._id);
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is already a ${requestedRole}`);
    }
    const validRoles = {
        DRIVER: user_interface_1.Role.DRIVER,
        RIDER: user_interface_1.Role.RIDER,
    };
    if (!validRoles[requestedRole]) {
        yield apply_model_1.Apply.findByIdAndDelete(application._id);
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid role application");
    }
    user.role = requestedRoleAsRole;
    yield user.save();
    application.isApproved = true;
    const updatedApplication = yield application.save();
    return updatedApplication;
});
exports.ApplyService = {
    createApplication,
    getMyApplication,
    cancelApplication,
    getAllApplications,
    approveApplication
};
