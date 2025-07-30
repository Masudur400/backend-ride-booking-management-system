import AppError from "../../errorHandler/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
import bcryptjs from 'bcryptjs'
import { envVars } from "../../config/env";
import { QueryBuilder } from "../../utils/queryBuilder";
import { userSearchableFields } from "./userConstant";



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
        password : hashedPassword,
        auths: [authProvider],
        ...rest
    })
    return user
}


const gerAllUsers = async (query:Record<string, string>)=>{
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
    return {data, meta}
}






export const UserServices = {
    createUser,
    gerAllUsers
}