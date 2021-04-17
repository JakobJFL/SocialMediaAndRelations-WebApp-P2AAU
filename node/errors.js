export {ValidationError, NoResourceError, AuthError, InternalError, reportError};
import {errorResponse} from "./server.js";

const InternalError = "Internal Error";
const ValidationError = "Validation Error";
const AuthError = "Authentication Error";
const NoResourceError = "No Such Resource";

function reportError(res,error){
    switch (error.message){
        case ValidationError: 
            return errorResponse(res,400,error.message);
        case AuthError: 
		    return errorResponse(res,403,error.message);
        case NoResourceError: 
		    return errorResponse(res,404,error.message);
        default:
            console.log(InternalError + ": " +error);
		    return errorResponse(res,500,"Internal Error");

    }
}
