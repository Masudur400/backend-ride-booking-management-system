import { TGenericErrorResponse } from "../interface/errorType";

export const handleDuplicateError = (err:any):TGenericErrorResponse =>{
const matchedArray = err.message.match(/"([^"]*)"/)
return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!!`
    }
}