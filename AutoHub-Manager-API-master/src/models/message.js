import mongoose from 'mongoose';
import User from './client.js';  // User model
import Vendor from './vendor.js';  // Vendor model

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel', // Dynamic reference (User or Vendor)
  },
  senderModel: {
    type: String,
    
    enum: ['User', 'Vendor'], // Specify the models allowed
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverModel', // Dynamic reference
  },
  receiverModel: {
    type: String,
    enum: ['User', 'Vendor'], // Specify the models allowed
  },
  message: {
    type: String,
    required: true,
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message', // Self-reference for replies
    default: null,
  },
}, { timestamps: true }); // Auto-manage createdAt and updatedAt

const Message = mongoose.model('Message', messageSchema);

export default Message;
