import mongoose from 'mongoose';

const UserModelSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'administrator', 'seller', 'delivery'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('User', UserModelSchema);
