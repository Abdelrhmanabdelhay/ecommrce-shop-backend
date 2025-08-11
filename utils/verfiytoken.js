import User from '../DataBase/models/user.model.js';
import bcrypt from 'bcryptjs';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const verfiyToken =async (req, res, next) => {
    try {
const token = req.headers.authorization?.split(' ')[1];
        if (!token) return next(new AppError('Authorization token is required', 401));

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload?.id) return next(new AppError('Invalid token', 401));

        const user = await User.findById(payload.id).select('-password');
        if (!user) return next(new AppError('User not found', 404));
        req.user = user; // Attach user to request object
        next();
    }
    catch (error) {
        next(new AppError('Failed to verify token', 401, error));
    }
}

export default verfiyToken;
