import mongoose, { Schema, model, models } from 'mongoose';

const ReviewSchema = new Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, required: true },
  verifiedPurchase: { type: Boolean, default: true },
});

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    tag: { type: String, default: 'NEW' },
    category: { type: String, default: 'General' },
    dopamineScore: { type: Number, default: 500 },
    sizes: { type: [String], default: ['S', 'M', 'L', 'XL'] },
    stock: { type: Number, default: 15 },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 12 },
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

export default models.Product || model('Product', ProductSchema);