import httpStatus from 'http-status-codes';
import AppError from "../../errorHandler/AppError"
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken"
import { User } from "../user/user.model"
import bcryptjs from 'bcryptjs'
import { envVars } from '../../config/env';
import { IAuthProvider, IsActive } from '../user/user.interface';
import jwt, { JwtPayload } from 'jsonwebtoken'; 
import { sendEmail } from '../../utils/sendEmail';




const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}

const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById({ userId })
    if (!user) {
        throw new AppError(404, "User not found");
    }
    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You have already set you password. Now you can change the password from your profile password update')
    }
    const hashedPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND))
    const credentialProvider: IAuthProvider = {
        provider: 'credentials',
        providerId: user.email
    }
    const auths: IAuthProvider[] = [...user.auths, credentialProvider]
    user.password = hashedPassword
    user.auths = auths
    await user.save()
}


const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user?.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match")
    }
    user.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    await user.save()
}




const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId)
     if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword,user?.password as string ) 
    if(!isOldPasswordMatch){
        throw new AppError(httpStatus.UNAUTHORIZED, 'old password does not match')
    } 
    user.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND)) 
    await user.save()
}


const forgotPassword = async (email:string) =>{
    const isUserExist = await User.findOne({email})
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist !')
    }
    if(!isUserExist.isVerified){
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
    }
    if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }
    const jwtPayload = {
        userId :isUserExist._id,
        email:isUserExist.email,
        role : isUserExist.role 
    }
    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET,{
        expiresIn:'10m'
    })
    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })

}







export const AuthServices = {
    getNewAccessToken,
    setPassword,
    changePassword,
    resetPassword,
    forgotPassword
}