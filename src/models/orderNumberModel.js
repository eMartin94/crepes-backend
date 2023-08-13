import mongoose from 'mongoose';

const OrderNumberModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model('OrderNumber', OrderNumberModelSchema);
