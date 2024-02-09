import user from './../modules/userModule.js';
import bcrypt from 'bcrypt';
import { errorHandler } from './../middleware/error.js';
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    const checkUser = await user.findOne({ email });
    if (checkUser) {
        return next(errorHandler(400, "User Already Exists"))
    }
    try {
        const newUser = new user({ name, email, password });
        await newUser.save();
        const { password: _, ...rest } = newUser._doc;
        const token = jwt.sign({ id: newUser._id, username: newUser.name }, process.env.JWT_SECRET);
        res.status(201).json({ user: rest, token: token });
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await user.findOne({ email });
        if (!validUser) {
            return next(errorHandler(400, "User Not Found"));
        }
        const matchPass = await bcrypt.compare(password, validUser.password);
        if (!matchPass) {
            return next(errorHandler(400, "Password Not Matched"))
        }
        else {
            const { password: _, ...rest } = validUser._doc;
            const token = jwt.sign({ id: validUser._id, username: validUser.name }, process.env.JWT_SECRET);
            res.status(201).json({ user: rest , token: token });
        }
    } catch (error) {
        next(error);
    }
}