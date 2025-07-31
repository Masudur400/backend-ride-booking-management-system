
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


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.RIDER) {
        if (userId !== decodedToken.userId) {
            throw new AppError(401, "You are not authorized")
        }
    }
    const isUserExist = await User.findById(userId)
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    if (decodedToken.role === Role.ADMIN && isUserExist.role === Role.SUPER_ADMIN) {
        throw new AppError(401, "You are not authorized")
    }
    if (payload.role) {
        if (payload.role === Role.USER || decodedToken.role === Role.RIDER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.RIDER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    } 
    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }) 
    return newUpdatedUser
}





export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    getMe,
    updateUser
}