import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const OrderModelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    },
    items: [OrderItemSchema],
    contactName: {
      type: String,
    },
    codCustomer: {
      type: String,
    },
    numberInvoice: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    shippingAddress: {
      type: String,
    },
    shippingCost: {
      type: Number,
      // required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pendiente', 'Confirmado', 'Enviado', 'Entregado'],
      default: 'Pendiente',
    },
    nroOrder: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('Order', OrderModelSchema);
