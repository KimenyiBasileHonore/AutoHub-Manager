import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CLIENT'
  },
  date: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
    
  },
  location: {
    type: String,
    
  },
  phoneNumber: {
    type: String,
    
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID'],
    default: 'PENDING'
  },
  orderStatus: {
    type: String,
    enum: ['PROCESSING', 'SHIPPED', 'DELIVERED'],
    default: 'PROCESSING'
  }
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;