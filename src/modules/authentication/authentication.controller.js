import User from '../../../DataBase/models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import AppError from '../../../utils/appError.js';
import crypto from 'crypto';
import { sendEmail } from '../../../utils/sendEmail.js'; // Assuming you have an email utility function
dotenv.config();
const createToken = (user) => {
  const tokenExpiry = remeberme ? '5d' : '1d'; // Set token expiry based on remember me option
  // Generate JWT token
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: tokenExpiry });
};
// Create a new user
  const SignUp=async (req, res, next) => {
    try {
        const { name, email, password ,role} = req.body;
        // Validate input
        if (!name || !email || !password) {
            return next(new AppError('Name, email, and password are required', 400));
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError('User already exists', 400));
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role:role || "user" // Default role
        });
        res.status(201).json({
            status: 'success',
            data: {
                user
            }
        });
    }
    catch (error) {
        next(new AppError(error.message, 500));
    }
}

 const Login = async (req, res, next) => {
    try {
        const { email, password,remeberme } = req.body;
        // Validate input
        if (!email || !password) {
            return next(new AppError('Email and password are required', 400));
        }
         const tokenExpiry = remeberme ? '5d' : '1d';
        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new AppError('Invalid email or password', 401));
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError('Invalid email or password', 401));
        }
        // Set token expiry based on remember me option
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: tokenExpiry});
        // Set token in cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'deployment' ? false : true, // Set secure flag based on environment
            sameSite: 'Strict',
            maxAge: remeberme ? 5 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 5 days or 1 day
        });
        const{password:userPassword,...userWithoutPassword} = user.toObject();

        res.status(200).json({
            status: 'success',
            user: {
                ...userWithoutPassword,
            }
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
}
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(new AppError('No token provided', 401));
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user by ID
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    // Generate a new token
        // Determine if this was a long-lived token (rememberMe)
    // If original expiration was > 5 days, assume it was a rememberMe token
    const isLongLived = decoded.exp - decoded.iat > 5 * 24 * 60 * 60;
    const expiresIn = isLongLived ? "5d" : "1d";
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: expiresIn });
    // Set the new token in cookies
        const{password:userPassword,...userWithoutPassword} = user.toObject();

    res.cookie('token', newToken, {
      httpOnly: true, // only the server can access this cookie
      secure: process.env.NODE_ENV === 'deployment' ? false : true,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully'
        , user: {
            ...userWithoutPassword,
        }
    });
    } catch (error) {
    console.error("Refresh Token Error:", error);
    // If token is invalid or expired
    if (error instanceof jwt.JsonWebTokenError) {
      res.clearCookie("token");
      return next(new AppError('Invalid or expired token', 401));
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
}


const forgetPassword = async (req, res, next) => {
    try { 
      const { email } = req.body;
      if (!email) {
        return next(new AppError('Email is required', 404));
      }
      const user =await User.findById({ email });
      if (!user) {
        return next(new AppError('User not found', 404));
      }
      const resetcode=Math.floor(100000 + Math.random() * 900000).toString();
      const hashedResetCode = await crypto.createHash('sha256').update(resetcode).digest('hex');
      user.passwordResetCode = hashedResetCode;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      user.passwordResetVerified = false;
      await user.save();
      const message="we received a request to reset your password. Use the code below to reset your password. If you did not request this, please ignore this email.";
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Code - Ecommerce App valid for 10 minutes',
        message: `Your password reset code is: ${resetcode}`,
        html: `<p>${message}</p><p>Reset Code: <strong>${resetcode}</strong></p>`
      });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
  }

  const verfiyResetCode=async (req, res, next) => {
    try {
      const hashedResetCode = await crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
      if (!hashedResetCode) {
        return next(new AppError('Reset code is required', 400));
      }
      const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() },
      });
      if (!user) {
        return next(new AppError('Invalid or expired reset code', 400));
      }
      user.passwordResetVerified = true;
      await user.save();
      res.status(200).json({
        status: 'success',
        message: 'Reset code verified successfully',
      });
    }
    catch (error) {
      next(new AppError(error.message, 500));
    }
  }

  const resetPassword = async (req, res, next) => {
    try{
      const user =User.findOne({email:req.body.email});
      if (!user) {
        return next(new AppError('User not found', 404));
      }
      if (!user.passwordResetVerified) {
        return next(new AppError('Reset code not verified', 400));
      }
      if (req.body.password !== req.body.confirmPassword) {
        return next(new AppError('Passwords do not match', 400));
      }
      user.password=req.body.password;
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;
      await user.save();
      const token = createToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'deployment' ? false : true,
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });
      const { password: userPassword, ...userWithoutPassword } = user.toObject();
      res.status(200).json({
        status: 'success',
        message: 'Password reset successfully',
        user: {
          ...userWithoutPassword,
        }
      });
    }catch (error) {
      next(new AppError(error.message, 500));
    }
  }
export { SignUp, Login, refreshToken, logout, forgetPassword, verfiyResetCode, resetPassword };