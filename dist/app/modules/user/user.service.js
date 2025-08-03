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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const queryBuilder_1 = require("../../utils/queryBuilder");
const userConstant_1 = require("./userConstant");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exist !");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = { provider: 'credentials', providerId: email };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest));
    return user;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const userData = queryBuilder
        .filter()
        .search(userConstant_1.userSearchableFields)
        .sort()
        .fields()
        .pagination();
    const [data, meta] = yield Promise.all([
        userData.build(),
        queryBuilder.getMeta()
    ]);
    return { data, meta };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select('-password');
    return {
        user
    };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user
    };
});
// const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload): Promise<IUser> => {
//     const requesterId = decodedToken.userId
//     const requesterRole = decodedToken.role
//     const targetUser = await User.findById(userId)
//     if (!targetUser) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User not found')
//     }
//     const targetRole = targetUser.role
//     // যদি role আপডেট করা হয়
//     if (payload.role) {
//         // USER, RIDER, DRIVER কেউ role আপডেট করতে পারবে না
//         if ([Role.USER, Role.RIDER, Role.DRIVER].includes(requesterRole)) {
//             throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update roles')
//         }
//         // ADMIN কেউ ADMIN বা SUPER_ADMIN বানাতে পারবে না
//         if (requesterRole === Role.ADMIN && [Role.ADMIN, Role.SUPER_ADMIN].includes(payload.role)) {
//             throw new AppError(httpStatus.FORBIDDEN, 'ADMIN is not authorized to assign ADMIN or SUPER_ADMIN roles')
//         }
//         // SUPER_ADMIN কেউ কাউকে SUPER_ADMIN বানাতে পারবে না (নিজেকেও না)
//         if (requesterRole === Role.SUPER_ADMIN && payload.role === Role.SUPER_ADMIN) {
//             throw new AppError(httpStatus.FORBIDDEN, 'SUPER_ADMIN cannot assign SUPER_ADMIN role to anyone, including self')
//         }
//         // SUPER_ADMIN কেউ অন্য SUPER_ADMIN এর role আপডেট করতে পারবে না
//         if (requesterRole === Role.SUPER_ADMIN && targetRole === Role.SUPER_ADMIN && requesterId !== userId) {
//             throw new AppError(httpStatus.FORBIDDEN, 'SUPER_ADMIN cannot update another SUPER_ADMIN')
//         }
//         // ADMIN & SUPER_ADMIN শুধু USER, RIDER, DRIVER এর role আপডেট করতে পারবে
//         const allowedRolesToAssign = [Role.USER, Role.RIDER, Role.DRIVER]
//         if (![Role.SUPER_ADMIN, Role.ADMIN].includes(requesterRole)) {
//             throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update roles');
//         }
//         if (!allowedRolesToAssign.includes(payload.role)) {
//             throw new AppError(httpStatus.FORBIDDEN, 'You can only assign USER, RIDER or DRIVER roles')
//         }
//     }
//     // isVerified, isDeleted শুধু ADMIN ও SUPER_ADMIN আপডেট করতে পারবে
//     const restrictedFields = ['isVerified', 'isDeleted']
//     for (const field of restrictedFields) {
//         if (field in payload && ![Role.ADMIN, Role.SUPER_ADMIN].includes(requesterRole)) {
//             throw new AppError(httpStatus.FORBIDDEN, `You are not authorized to update ${field}`)
//         }
//     }
//     // নিজেকে ছাড়া অন্যদের আপডেট করতে চাইলে অবশ্যই ADMIN বা SUPER_ADMIN হতে হবে
//     const isSelfUpdate = requesterId === userId;
//     if (!isSelfUpdate && ![Role.ADMIN, Role.SUPER_ADMIN].includes(requesterRole)) {
//         throw new AppError(httpStatus.UNAUTHORIZED, 'You are not allowed to update other users')
//     }
//     const updatedUser = await User.findByIdAndUpdate(userId, payload, {
//         new: true,
//         runValidators: true,
//     }) as IUser
//     return updatedUser
// };
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const requesterId = decodedToken.userId;
    const requesterRole = decodedToken.role;
    const targetUser = yield user_model_1.User.findById(userId);
    if (!targetUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const targetRole = targetUser.role;
    // যদি role আপডেট করা হয়
    if (payload.role) {
        // USER, RIDER, DRIVER কেউ role আপডেট করতে পারবে না
        if ([user_interface_1.Role.USER, user_interface_1.Role.RIDER, user_interface_1.Role.DRIVER].includes(requesterRole)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update roles');
        }
        // ADMIN কেউ ADMIN বা SUPER_ADMIN বানাতে পারবে না
        if (requesterRole === user_interface_1.Role.ADMIN) {
            if ([user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN].includes(payload.role)) {
                throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'ADMIN cannot assign ADMIN or SUPER_ADMIN roles');
            }
        }
        // SUPER_ADMIN কেউ কাউকে SUPER_ADMIN বানাতে পারবে না (নিজেকেও না)
        if (requesterRole === user_interface_1.Role.SUPER_ADMIN && payload.role === user_interface_1.Role.SUPER_ADMIN) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'SUPER_ADMIN cannot assign SUPER_ADMIN role');
        }
        // SUPER_ADMIN কেউ অন্য SUPER_ADMIN এর role আপডেট করতে পারবে না
        if (requesterRole === user_interface_1.Role.SUPER_ADMIN &&
            targetRole === user_interface_1.Role.SUPER_ADMIN &&
            requesterId !== userId) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'SUPER_ADMIN cannot update another SUPER_ADMIN');
        }
        // শুধু SUPER_ADMIN পারবে ADMIN বানাতে
        if (payload.role === user_interface_1.Role.ADMIN && requesterRole !== user_interface_1.Role.SUPER_ADMIN) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Only SUPER_ADMIN can assign ADMIN role');
        }
        // SUPER_ADMIN & ADMIN শুধু USER, RIDER, DRIVER assign করতে পারবে
        const allowedRolesToAssign = [user_interface_1.Role.USER, user_interface_1.Role.RIDER, user_interface_1.Role.DRIVER];
        if (requesterRole === user_interface_1.Role.SUPER_ADMIN) {
            allowedRolesToAssign.push(user_interface_1.Role.ADMIN); // SUPER_ADMIN এর জন্য ADMIN ও ALLOWED
        }
        if (!allowedRolesToAssign.includes(payload.role)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Invalid role assignment');
        }
    }
    // isVerified, isDeleted শুধু ADMIN ও SUPER_ADMIN আপডেট করতে পারবে
    const restrictedFields = ['isVerified', 'isDeleted'];
    for (const field of restrictedFields) {
        if (field in payload && ![user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN].includes(requesterRole)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, `You are not authorized to update ${field}`);
        }
    }
    // নিজেকে ছাড়া অন্যদের আপডেট করতে চাইলে অবশ্যই ADMIN বা SUPER_ADMIN হতে হবে
    const isSelfUpdate = requesterId === userId;
    if (!isSelfUpdate && ![user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN].includes(requesterRole)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not allowed to update other users');
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedUser;
});
exports.UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    getMe,
    updateUser
};
