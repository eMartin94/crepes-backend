import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true
  },
  cantidad: {
    type: Number,
    default: 1,
    required: true
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    ref: "User",
    required: false,
    unique: true,
  },
  items: [cartItemSchema],
},
  {
    timestamps: true,
    versionKey: false,
  });

export default mongoose.model("Cart", cartSchema);