import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
  },
  precio: {
    type: Number,
    required: true,
  },
  ingredientes: {
    type: [String],
    required: true,
  },
  imagen: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  subcategoria: {
    type: String,
    trim: true,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  cartRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
},
  {
    timestamps: true,
    versionKey: false
  }
)

export default mongoose.model('Producto', productSchema);