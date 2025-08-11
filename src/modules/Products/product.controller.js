import Product from "../../../DataBase/models/product.model.js";
import AppError from "../../../utils/appError.js";
import { notfiyAdmin } from "../../../utils/socket.io.js";
// Create a new product
const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, category,stock } = req.body;
        // Validate input
        const image= req.file?.path; // Assuming you are using multer for file upload
        if (!image) {
            return next(new AppError('Image is required', 400));
        }
        if (!name || !price || !description || !category || !stock) {
            return next(new AppError('All fields are required', 400));
        }
        const existingProduct= await Product.findOne({ name, category });
        if (existingProduct) {
            return next(new AppError('Product already exists in this category', 400));
        }
        // Validate price and stock
        if (price <= 0) {
            return next(new AppError('Price must be greater than 0', 400));
        }
        if (stock < 0) {
            return next(new AppError('Stock cannot be negative', 400));
        }
        // Create a new product
        const product = await Product.create({
            name,
            price,
            description,
            category,
            stock,
            image,
            seller: req.user._id // Associate product with the user
        });
        // Notify admin via WebSocket
        notfiyAdmin(`New product created: ${product.name}`, { productId: product._id, sellerId: req.user._id ,role: req.user.role});
        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            data: {
                product
            }
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};
// Get all products
const getAllProducts = async (req, res, next) => {
    const{name,category ,stock ,page = 1, limit = 10 } = req.query;
    try{
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        // Build matchStage
        const matchStage = {};

        if (name) {
            matchStage.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            matchStage.category = { $regex: category, $options: 'i' };
        }
        if (stock) {
            matchStage.stock = stock;
        }

        const pipeline = [
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limitNumber }
        ];

        const products = await Product.aggregate(pipeline);

        // Get total count for pagination
        const countResult = await Product.aggregate([
            { $match: matchStage },
            { $count: "total" }
        ]);

        const total = countResult[0]?.total || 0;
        const totalPages = Math.ceil(total / limitNumber);

        res.status(200).json({
            status: "success",
            products,
            total,
            totalPages,
            currentPage: pageNumber,
            
        });

    }
    catch (error) {
        next(new AppError(error.message, 500));
    }
}
// Get product by ID
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params.id;
        const product = await Product.findById(id).populate('seller', 'name email -_id');
        if (!product) {
            return next(new AppError('Product not found', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                product
            }
        });
    }
    catch (error) {
        next(new AppError(error.message, 500));
    }
}
// Update product by ID
const updateProductById = async (req, res, next) => {
    try {
        const  id  = req.params.id;
        const { name, price, description, category, stock, image } = req.body;
        // Validate input
        if (!name || !price || !description || !category || !stock || !image) {
            return next(new AppError('All fields are required', 400));
        }
        // Find product by ID and update
        const product = await Product.findByIdAndUpdate(id, {
            name,
            price,
            description,
            category,
            stock,
            image
        }, { new: true });

        if (!product) {
            return next(new AppError('Product not found', 404));
        }
        // Notify admin via WebSocket
        notfiyAdmin(`Product updated: ${product.name}`, { productId: product._id, sellerId: req.user._id, role: req.user.role });
        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: {
                product
            }
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
}
// Delete product by ID
const deleteProductById = async (req, res, next) => {
    try {
        const  id  = req.params.id;
        if (!id) {
            return next(new AppError('Product ID is required', 400));   
        }
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return next(new AppError('Product not found', 404));
        }
        res.status(204).json({
            status: 'success',
            message: 'Product deleted successfully',
            data: null
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
}

const getProductsBySeller = async (req, res, next) => {
    try {
        const sellerId = req.user._id; // Assuming the user is authenticated and their ID is available
        const products = await Product.find({ seller: sellerId })
            .populate('seller', 'name email -_id')
            .sort({ createdAt: -1 }); // Sort by creation date, most recent first
        if (products.length === 0) {
            return next(new AppError('No products found for this seller', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                products
            }
        });
    }
    catch (error) {
        next(new AppError(error.message, 500));
    }
}
const rateProduct = async (req, res, next) => {
    try {
        const  id  = req.params.id;
        if (!id) {
            return next(new AppError('Product ID is required', 400));
        }
        const { rating } = req.body;
        if (!rating) {
            return next(new AppError('Rating is required', 400));
        }
        if (typeof rating !== 'number') {
            return next(new AppError('Rating must be a number', 400));
        }
        // Validate rating
        if (rating < 0 || rating > 5) {
            return next(new AppError('Rating must be between 0 and 5', 400));
        }

        // Find product by ID
        const product = await Product.findById(id);
        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        // Update ratings
        const totalRatings = product.ratings.count + 1;
        const newAverage = ((product.ratings.average * product.ratings.count) + rating) / totalRatings;

        product.ratings.average = newAverage;
        product.ratings.count = totalRatings;

        await product.save();

        res.status(200).json({
            status: 'success',
            message: 'Product rated successfully',
            data: {
                product
            }
        });
    }
    catch (error) {
        next(new AppError(error.message, 500));
    }
}
export{
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    getProductsBySeller,
    rateProduct
};