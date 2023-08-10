import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  }
},
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model("Categoria", categorySchema);