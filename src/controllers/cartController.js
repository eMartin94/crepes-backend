import Cart from '../models/cartModel.js';
import Producto from '../models/productModel.js';

export const listarCarrito = async (req, res) => {
  const { cart } = req;
  return res.json({ cart });
};

export const listarCarritos = async (req, res) => {
  try {
    const allCarts = await Cart.find().populate('user', 'username');
    return res.json({ carts: allCarts });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar carritos' });
  }
};

export const agregarCarrito = async (req, res) => {
  const { cart } = req;
  const { productId, cantidad } = req.body;
  try {
    const product = await Producto.findById(productId);

    if (!product)
      return res.status(404).json({ message: 'Producto no encontrado' });

    const itemExistente = cart.items.find((item) => item.product.toString() === productId);
    itemExistente
      ? itemExistente.cantidad += cantidad
      : cart.items.push({ product: productId, cantidad });
    req.user
      ? await Cart.findByIdAndUpdate(cart._id, { items: cart.items })
      : res.cookie('cart', JSON.stringify(cart.items));
    return res.json({ cart });
  } catch (error) {
    return res.status(500).json({ message: 'Error al agregar al carrito' });
  }

};

export const eliminarCarrito = async (req, res) => {
  const { cart } = req;
  const { productId } = req.params;
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  req.user
    ? await Cart.findByIdAndUpdate(cart._id, { items: cart.items })
    : res.cookie('cart', JSON.stringify(cart.items));
  return res.json({ cart });
};

export const actualizarCantidadCarrito = async (req, res) => {
  const { cart } = req;
  const { productId } = req.params;
  const { cantidad } = req.body;
  const itemExistente = cart.items.find((item) => item.product.toString() === productId);
  if (itemExistente) itemExistente.cantidad = cantidad;
  req.user
    ? await Cart.findByIdAndUpdate(cart._id, { items: cart.items })
    : res.cookie('cart', JSON.stringify(cart.items));
  return res.json({ cart });
};
