import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = async(req,res,next) => {
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader && tokenHeader.split(' ')[1];
    if(!token){
        return next(errorHandler(400, "Unauthorized"));
    };
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
            if(err){
                return next();
            }
            req.user = user;
            return next();
        });
    } catch (error) {
        next(error);
    }
}