import Producto from '../models/productModel.js';
import Order from '../models/orderModel.js';
import OrderNumber from '../models/orderNumberModel.js';

export const crearOrden = async (req, res) => {
  const { cart } = req;

  if (!req.user)
    return res.status(401).json({ message: 'Unauthorized - User not found' });

  try {
    const productIds = cart.items.map(item => item.product);
    const products = await Producto.find({
      _id: { $in: productIds }
    });

    const itemsWithPrice = cart.items.map(item => {
      const product = products.find(p => p._id.toString() === item.product.toString());
      return {
        product: item.product,
        quantity: item.cantidad,
        price: product.precio,
      };
    });

    const totalAmount = itemsWithPrice.reduce((total, item) => total + item.price * item.quantity, 0);

    const counter = await OrderNumber.findOneAndUpdate({ name: "orderCounter" }, { $inc: { value: 1 } }, { new: true, upsert: true });
    const formattedOrderNumber = `CN${String(counter.value).padStart(7, '0')}`;

    const order = await Order.create({
      user: req.user.id,
      items: itemsWithPrice,
      totalAmount,
      nroOrder: formattedOrderNumber,
    });

    cart.items = [];
    await cart.save();

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear la orden' });
  }
};


export const listarOrdenes = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .populate('items.product', 'nombre precio categoria disponible imagen.secure_url descripcion subcategoria nroOrder');
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar las órdenes' });
  }
};

export const listarTodasLasOrdenes = async (req, res) => {
  try {

    if (!req.user || (!req.user.role.includes('administrator') && !req.user.role.includes('seller'))) {
      return res.status(403).json({ message: 'Forbidden - Admin or Seller access required' });
    }

    const orders = await Order.find().sort({ createdAt: -1 })
      .populate('user', 'username')
      .populate('items.product', 'nombre precio categoria disponible imagen.secure_url descripcion subcategoria nroOrder');

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar todas las órdenes' });
  }
};

export const actualizarEstadoOrden = async (req, res) => {
  const { orderId } = req.params;
  const { nuevoEstado } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: nuevoEstado },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ message: 'Orden no encontrada' });

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el estado de la orden' });
  }
};