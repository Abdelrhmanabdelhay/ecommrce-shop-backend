import { date } from "joi";
import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
    message: {
    type: String,
    required: true
    },
    data: {
    type: Object,
    default: {}
    },
    isRead: {
    type: Boolean,
    default: false
    },
    createdAt: {
    type: Date,
    default: Date.now
    }
});
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;