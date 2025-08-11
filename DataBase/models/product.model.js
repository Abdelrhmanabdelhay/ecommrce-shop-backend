import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price must be at least 0"],
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock cannot be negative"],
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // so we can show "products added by this admin"
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

export const Product = mongoose.model('Product', productSchema);
export default Product;
