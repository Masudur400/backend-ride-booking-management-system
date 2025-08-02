import AppError from "../../errorHandler/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
import bcryptjs from 'bcryptjs'
import { envVars } from "../../config/env";
import { QueryBuilder } from "../../utils/queryBuilder";
import { userSearchableFields } from "./userConstant";
import { JwtPayload } from "jsonwebtoken";



const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist !")
    }
    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    const authProvider: IAuthProvider = { provider: 'credentials', providerId: email as string }
    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })
    return user
}


const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query)
    const userData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .pagination()
    const [data, meta] = await Promise.all([
        userData.build(),
        queryBuilder.getMeta()
    ])
    return { data, meta }
}


const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select('-password')
    return {
        user
    }
}


const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
}


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload): Promise<IUser> => {
    const requesterId = decodedToken.userId;
    const requesterRole = decodedToken.role;
    const targetUser = await User.findById(userId);
    if (!targetUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    const targetRole = targetUser.role;
    // যদি role আপডেট করা হয়
    if (payload.role) {
        // USER, RIDER, DRIVER কেউ role আপডেট করতে পারবে না
        if ([Role.USER, Role.RIDER, Role.DRIVER].includes(requesterRole)) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update roles');
        }
        // ADMIN কেউ ADMIN বা SUPER_ADMIN বানাতে পারবে না
        if (requesterRole === Role.ADMIN && [Role.ADMIN, Role.SUPER_ADMIN].includes(payload.role)) {
            throw new AppError(httpStatus.FORBIDDEN, 'ADMIN is not authorized to assign ADMIN or SUPER_ADMIN roles');
        }
        // SUPER_ADMIN কেউ কাউকে SUPER_ADMIN বানাতে পারবে না (নিজেকেও না)
        if (requesterRole === Role.SUPER_ADMIN && payload.role === Role.SUPER_ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, 'SUPER_ADMIN cannot assign SUPER_ADMIN role to anyone, including self');
        }
        // SUPER_ADMIN কেউ অন্য SUPER_ADMIN এর role আপডেট করতে পারবে না
        if (requesterRole === Role.SUPER_ADMIN && targetRole === Role.SUPER_ADMIN && requesterId !== userId) {
            throw new AppError(httpStatus.FORBIDDEN, 'SUPER_ADMIN cannot update another SUPER_ADMIN');
        }
        // ADMIN & SUPER_ADMIN শুধু USER, RIDER, DRIVER এর role আপডেট করতে পারবে
        const allowedRolesToAssign = [Role.USER, Role.RIDER, Role.DRIVER];
        if (![Role.SUPER_ADMIN, Role.ADMIN].includes(requesterRole)) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update roles');
        }
        if (!allowedRolesToAssign.includes(payload.role)) {
            throw new AppError(httpStatus.FORBIDDEN, 'You can only assign USER, RIDER or DRIVER roles');
        }
    }
    // isVerified, isDeleted শুধু ADMIN ও SUPER_ADMIN আপডেট করতে পারবে
    const restrictedFields = ['isVerified', 'isDeleted'];
    for (const field of restrictedFields) {
        if (field in payload && ![Role.ADMIN, Role.SUPER_ADMIN].includes(requesterRole)) {
            throw new AppError(httpStatus.FORBIDDEN, `You are not authorized to update ${field}`);
        }
    }
    // নিজেকে ছাড়া অন্যদের আপডেট করতে চাইলে অবশ্যই ADMIN বা SUPER_ADMIN হতে হবে
    const isSelfUpdate = requesterId === userId;
    if (!isSelfUpdate && ![Role.ADMIN, Role.SUPER_ADMIN].includes(requesterRole)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not allowed to update other users');
    }
    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    }) as IUser
    return updatedUser;
};






export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    getMe,
    updateUser
}