export const errorHandler = (statuscode,message,next) =>{
    const error = new Error();
    error.statuscode = statuscode;
    error.message = message;
    return error;
}