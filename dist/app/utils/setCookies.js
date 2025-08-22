"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
// --------------------------it only use for production -------------------
// export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
//     if (tokenInfo.accessToken) {
//         res.cookie("accessToken", tokenInfo.accessToken, {
//             httpOnly: true,
//             secure: envVars.NODE_ENV === "production",
//             sameSite: "none"
//         })
//     }
//     if (tokenInfo.refreshToken) {
//         res.cookie("refreshToken", tokenInfo.refreshToken, {
//             httpOnly: true,
//             secure: envVars.NODE_ENV === "production",
//             sameSite: "none"
//         })
//     }
// }
// -----------------it only use for development----------------------- 
const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
    }
};
exports.setAuthCookie = setAuthCookie;
