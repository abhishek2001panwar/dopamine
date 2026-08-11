import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fakeBalance: { type: Number, default: 10000 },

    // Onboarding & Profile Customization
    onboarded: { type: Boolean, default: false },
    deliveryAddress: { type: String, default: 'The Cloud' },
    shoppingVibe: { type: String, default: 'Midnight Impulse' },

    // Cart & Stats
    cart: {
      type: [
        {
          _id: String,
          title: String,
          price: Number,
          image: String,
        },
      ],
      default: [],
    },
    streakCount: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastClaimedDate: { type: Date, default: null },
    unlockedBadges: { type: [String], default: [] },
    totalSpent: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    
  },
  { timestamps: true }
);

export const User = models.User || model('User', UserSchema);