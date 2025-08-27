"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const env_1 = require("../config/env");
// --------------------------it only use for production -------------------
const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
};
exports.setAuthCookie = setAuthCookie;
// -----------------it only use for development----------------------- 
// export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
// if (tokenInfo.accessToken) {
//         res.cookie("accessToken", tokenInfo.accessToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//         }) 
//     }
//     if (tokenInfo.refreshToken){
//         res.cookie("refreshToken", tokenInfo.refreshToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none"
//         })
//     } 
// }
