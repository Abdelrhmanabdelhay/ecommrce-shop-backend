import SellerRequest from "../../../DataBase/models/sellerrequest.model.js";
import AppError from "../../../utils/appError.js";
import User from '../../../DataBase/models/user.model.js';
// Create a new seller request
const createSellerRequest = async (req, res, next) => {
    try {
        const existing=await SellerRequest.findOne({ user: req.user._id });
        if (existing) {
            return next(new AppError('You have already submitted a seller request', 400));
        }
        const { businessName,
                businessType,
                businessAddress,
                businessEmail,
                taxIdOrNationalId,
                storeName,
                phoneNumber,
                website,
                productCategories,
                estimatedMonthlySales,
                message } = req.body;
        // Validate input
        if (!businessName || !businessAddress || !phoneNumber || !businessEmail || !businessType || !taxIdOrNationalId || !storeName || !productCategories || !estimatedMonthlySales) {
            return next(new AppError('All fields are required', 400));
        }
        // Create a new seller request
        const sellerRequest = await SellerRequest.create({
            user: req.user._id, // Associate request with the user
            businessName,
            businessAddress,
            businessEmail,
            businessType,
            taxIdOrNationalId,
            storeName,
            phoneNumber,
            website,
            productCategories,
            estimatedMonthlySales,
            message,
            status: 'pending' // Default status
        });

        res.status(201).json({
            status: 'success',
            message: 'Seller request created successfully',
            data: {
                sellerRequest
            }
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
}

// Get all seller requests
const getAllSellerRequests = async (req, res, next) => {
    try {
        const{businessName,businessType,storeName,status,page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
        // Build matchStage
        const matchStage={};
        if (businessName) {
            matchStage.businessName = { $regex: businessName, $options: 'i' };
        }
        if (businessType) {
            matchStage.businessType = { $regex: businessType, $options: 'i' };
        }
        if (storeName) {
            matchStage.storeName = { $regex: storeName, $options: 'i' };
        }
        if (status) {
            matchStage.status = { $regex: status, $options: 'i' };
        }
        const pipeline = [
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limitNumber }
        ];
        const sellerRequests = await SellerRequest.aggregate(pipeline);
        // Get total count for pagination
        const countResult = await SellerRequest.aggregate([
            { $match: matchStage },
            { $count: "total" }
        ]);
        const total = countResult[0]?.total || 0;
        const totalPages = Math.ceil(total / limitNumber);
        res.status(200).json({
            status: "success",
            sellerRequests,
            total,
            totalPages,
            currentPage: pageNumber
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
}
 const handleSellerRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new AppError('Request ID is required', 400));
    }

    const { status } = req.body;

    if (!status) {
      return next(new AppError('Status is required', 400));
    }

    if (!['approved', 'rejected'].includes(status)) {
      return next(new AppError('Invalid status value', 400));
    }

    const request = await SellerRequest.findById(id);

    if (!request) {
      return next(new AppError('Request not found', 404));
    }

    if (status === 'approved') {
      await User.findByIdAndUpdate(request.user, { role: 'seller' });
    }

    request.status = status;
    request.reviewedBy = req.user._id;

    await request.save();

    res.status(200).json({ status: 'success', message: `Request ${status}` });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};


export {
    createSellerRequest,
    getAllSellerRequests,
    handleSellerRequest
};