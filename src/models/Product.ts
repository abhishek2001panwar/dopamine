import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    tag: { type: String, required: true },
    dopamineScore: { type: Number, default: 500 },

    // Drop Culture Fields
    isDrop: { type: Boolean, default: false },
    dropStartTime: { type: Date, default: null }, // e.g., Drop goes live at 5 PM
    virtualStock: { type: Number, default: 50 }, // Limited fake supply (e.g., only 50 exist)
    claimedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product = models.Product || model('Product', ProductSchema);