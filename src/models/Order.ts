import mongoose, { Schema, model, models } from 'mongoose';

// 1. Explicitly define the Order Item Sub-Schema
const OrderItemSchema = new Schema(
  {
    _id: { type: String }, // Preserves original product ID
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // 👈 Explicitly required image string
    category: { type: String, default: 'General' },
    selectedSize: { type: String, default: 'Standard' },
  },
  { _id: false } // Prevents Mongoose from overwriting custom product _id
);

// 2. Define the main Order Schema
const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    items: [OrderItemSchema], // 👈 Uses the strict sub-schema defined above
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String },
    paymentCard: { type: String },
    deliveryStatus: { type: String, default: 'Stuck floating in the cloud ☁️' },
  },
  { timestamps: true }
);

export const Order = models.Order || model('Order', OrderSchema);