import User from '../../../DataBase/models/user.model.js';
import bcrypt from 'bcryptjs';
import AppError from '../../../utils/appError.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
// Get all users
 const getAllUsers = async (req, res, next) => {
  try {
    const { name, email, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Build matchStage
    const matchStage = {};

    if (name) {
      matchStage.name = { $regex: name, $options: 'i' };
    }

    if (email) {
      matchStage.email = { $regex: email, $options: 'i' };
    }

    const pipeline = [
      { $match: matchStage },
      {
        $project: {
          password: 0 // exclude password
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limitNumber }
    ];

    const users = await User.aggregate(pipeline);

    // Get total count for pagination
    const countResult = await User.aggregate([
      { $match: matchStage },
      { $count: "total" }
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      status: "success",
      users,
      total,
      totalPages,
      currentPage: pageNumber
    });

  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

 const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({
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

 const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({
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

 const deleteUser=async(req,res,next) =>{
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  }
  catch (error) {
    next(new AppError(error.message, 500));
  }
}
export { getAllUsers, getUserById, updateUser, deleteUser };