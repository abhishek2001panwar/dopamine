import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    items: [
      {
        title: String,
        price: Number,
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryStatus: { type: String, default: 'Stuck floating in the cloud ☁️' },
  },
  { timestamps: true }
);

export const Order = models.Order || model('Order', OrderSchema);