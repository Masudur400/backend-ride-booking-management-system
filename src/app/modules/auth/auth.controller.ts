/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHandler/AppError";
import { createUserToken } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setCookies";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from 'http-status-codes'
import { JwtPayload } from "jsonwebtoken";
import { AuthServices } from "./auth.service";
import { envVars } from "../../config/env";





const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
    passport.authenticate("local", async (error: any, user: any, info: any) => {
        if (error) {
            return next(new AppError(401, error))
        }
        if (!user) {
            return next(new AppError(401, info.message))
        }
        const userTokens = await createUserToken(user)
        const { password: pass, ...rest } = user.toObject()
        setAuthCookie(res, userTokens)
        sendResponse(res, {
            success: true,
            statusCode: httpStatusCode.OK,
            message: 'User logged in successfully !',
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        })
    })(req, res, next) 
})

 


const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new AppError(httpStatusCode.BAD_REQUEST, 'no refresh token received from cookies')
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)
    setAuthCookie(res, tokenInfo)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "new access token retrieved Successfully",
        data: tokenInfo,
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    })
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Logged out Successfully",
        data: null,
    })
})


const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword
    const oldPassword = req.body.oldPassword
    const decodedToken = req.user
    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "reset password Successfully",
        data: null,
    })
}) 


const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    let redirectTo = req.query.state ? req.query.state as string : ""
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    if (!user) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user not found")
    }
    const tokenInfo = createUserToken(user)
    setAuthCookie(res, tokenInfo)
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword
    const oldPassword = req.body.oldPassword
    const decodedToken = req.user
    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "reset password Successfully",
        data: null,
    })
})


const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const { password } = req.body;
    await AuthServices.setPassword(decodedToken.userId, password);
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})


const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await AuthServices.forgotPassword(email);
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Email Sent Successfully",
        data: null,
    })
})








export const AuthControllers = {
    credentialLogin,
    getNewAccessToken,
    logout,
    changePassword,
    resetPassword,
    googleCallbackController,
    setPassword,
    forgotPassword
}