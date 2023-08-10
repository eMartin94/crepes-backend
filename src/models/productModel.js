import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
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
    public_id: String,
    secure_url: String,
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
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
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

productSchema.plugin(mongoosePaginate);

export default mongoose.model('Producto', productSchema);