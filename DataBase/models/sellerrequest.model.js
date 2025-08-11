// models/sellerRequest.model.js
import mongoose from 'mongoose';

const sellerRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  businessType: {
    type: String,
    enum: ['individual', 'company'],
    required: true,
  },
  taxIdOrNationalId: {
    type: String,
    required: true,
    trim: true,
  },
  storeName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    trim: true,
  },
  productCategories: {
    type: [String],
    default: [],
  },
  estimatedMonthlySales: {
    type: String,
    enum: ['<1K', '1K-5K', '5K-20K', '20K+'],
    default: '<1K'
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const SellerRequest = mongoose.model('SellerRequest', sellerRequestSchema);
export default SellerRequest;