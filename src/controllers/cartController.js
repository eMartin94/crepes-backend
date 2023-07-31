import Cart from '../models/cartModel.js';

export const listarCarrito = async (req, res) => {
  const { cart } = req;
  return res.json({ cart });
};

export const agregarCarrito = async (req, res) => {
  const { cart } = req;
  const { productId, cantidad } = req.body;

  const itemExistente = cart.items.find((item) => item.product.toString() === productId);
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    cart.items.push({ product: productId, cantidad });
  }

  if (req.user) {
    await Cart.findByIdAndUpdate(cart._id, { items: cart.items });
  } else {
    res.cookie('cart', JSON.stringify(cart.items));
  }

  return res.json({ cart });
};

export const eliminarCarrito = async (req, res) => {
  const { cart } = req;
  const { productId } = req.params;

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);

  if (req.user) {
    await Cart.findByIdAndUpdate(cart._id, { items: cart.items });
  } else {
    res.cookie('cart', JSON.stringify(cart.items));
  }

  return res.json({ cart });
};

export const actualizarCantidadCarrito = async (req, res) => {
  const { cart } = req;
  const { productId } = req.params;
  const { cantidad } = req.body;

  const itemExistente = cart.items.find((item) => item.product.toString() === productId);
  if (itemExistente) itemExistente.cantidad = cantidad;

  if (req.user) {
    await Cart.findByIdAndUpdate(cart._id, { items: cart.items });
  } else {
    res.cookie('cart', JSON.stringify(cart.items));
  }

  return res.json({ cart });
};