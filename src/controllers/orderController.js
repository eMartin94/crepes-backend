import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import OrderNumber from '../models/orderNumberModel.js';
import Cart from '../models/cartModel.js';

export const createOrder = async (customer, data) => {
  try {
    const cart = JSON.parse(customer.metadata.cart);
    const user = JSON.stringify(customer.metadata.userId);

    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

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

    const address = `${data.customer_address.line1}, ${data.customer_address.city}, ${data.customer_address.country}`;
    const amount_subtotal = data.subtotal;
    const shippingCost = data.shipping_cost.amount_total;
    const total = data.total;
    let paymentStatus;
    // data.payment_status === 'paid' ? (paymentStatus = 'Pagado') : (paymentStatus = 'Pendiente');
    data.status === 'paid' ? (paymentStatus = 'Pagado') : (paymentStatus = 'Fallido');

    const counter = await OrderNumber.findOneAndUpdate(
      { name: 'orderCounter' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    const formattedOrderNumber = `CN${String(counter.value).padStart(7, '0')}`;

    const order = await Order.create({
      user: user ? user.id : null,
      items: itemsWithPrice,
      codCustomer: data.customer,
      numberInvoice: data.number,
      contactName: data.customer_name,
      contactPhone: data.customer_phone,
      contactEmail: data.customer_email,
      shippingAddress: address,
      shippingCost: shippingCost / 100,
      subtotal: amount_subtotal / 100,
      totalAmount: total / 100,
      paymentStatus: paymentStatus,
      nroOrder: formattedOrderNumber,
    });

    if (user) {
      const foundCart = await Cart.findById(cart._id);
      if (foundCart) {
        foundCart.items = [];
        await foundCart.save();
      }
    } else {
      //
    }

    console.log('Order created:', order);
  } catch (err) {
    console.log('Error creating order:', err);
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
