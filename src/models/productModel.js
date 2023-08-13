import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    ingredients: {
      type: [String],
      // required: true,
    },
    imagen: {
      public_id: String,
      secure_url: String,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    cartRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ProductModelSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', ProductModelSchema);
