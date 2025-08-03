import { Response } from "express"; 

export interface AuthTokens {
    accessToken?: string
    refreshToken?: string
}


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

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {

    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: false,
        })

    }
    if (tokenInfo.refreshToken){
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: false,
        })
    }

}