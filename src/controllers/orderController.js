import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import OrderNumber from '../models/orderNumberModel.js';

export const createOrder = async (req, res) => {
  const { user, cart } = req;

  if (!cart.items || cart.items.length === 0)
    return res.status(400).json({ message: 'El carrito está vacío' });

  try {

    const productIds = cart.items.map((item) => item.product);
    const products = await Product.find({
      _id: { $in: productIds },
    });

    const itemsWithPrice = cart.items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.product.toString());
      return {
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const totalAmount = itemsWithPrice.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const counter = await OrderNumber.findOneAndUpdate(
      { name: 'orderCounter' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    const formattedOrderNumber = `CN${String(counter.value).padStart(7, '0')}`;

    const order = await Order.create({
      user: user ? user._id : null,
      items: itemsWithPrice,
      totalAmount,
      nroOrder: formattedOrderNumber,
    });


    if (user) {
      cart.items = [];
      await cart.save();
    } else {
      console.log(cart.items);
      res.clearCookie('tempCartId');
      res.clearCookie('cart');
      // return res.json({ order, message: 'Carrito temporal limpiado' });
    }

    return res.json({ order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error al crear la orden' });
  }
};

export const listOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .populate(
        'items.product',
        'name price category available imagen.secure_url description subcategory nroOrder'
      );
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar las órdenes' });
  }
};

export const listAllOrders = async (req, res) => {
  try {
    if (
      !req.user ||
      (!req.user.role.includes('administrator') && !req.user.role.includes('seller'))
    ) {
      return res.status(403).json({ message: 'Forbidden - Admin or Seller access required' });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .populate(
        'items.product',
        'name price category available imagen.secure_url description subcategory nroOrder'
      );

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar todas las órdenes' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });

    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el estado de la orden' });
  }
};
