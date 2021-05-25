export {ValidationError, NoResourceError, AuthError, InternalError, MessageTooLongError, NoAccessGroupError, reportError};
import {errorResponse} from "./server.js";

const ValidationError = "Validation Error";
const MessageTooLongError="MsgTooLong";
const AuthError = "Authentication Error";
const NoAccessGroupError = "User credentials do not have access to this group";
const NoResourceError = "No Such Resource";
const InternalError = "Internal Error";

function reportError(res, error){
    switch (error.message) {
        case ValidationError: 
            return errorResponse(res, 400, error.message);
        case MessageTooLongError: 
		    return errorResponse(res, 400, error.message);
        case AuthError: 
		    return errorResponse(res, 403, error.message);
        case NoAccessGroupError: 
		    return errorResponse(res, 403, error.message);
        case NoResourceError: 
		    return errorResponse(res, 404, error.message);
        default:
            console.log(InternalError + ": " + error);
		    return errorResponse(res, 500, "Internal Error");
    }
}
