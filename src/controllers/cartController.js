import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// export const listCart = async (req, res) => {
//   const { cart } = req;
//   console.log(cart);
//   return res.json({ cart });
// };

export const listCart = async (req, res) => {
  const { cart } = req;

  try {
    const cartItems = await Promise.all(
      cart.items.map(async (item) => {
        const populatedProduct = await Product.findById(item.product).select(
          'name price category available imagen.secure_url description subcategory'
        );
        return {
          product: populatedProduct,
          quantity: item.quantity,
          _id: item._id,
        };
      })
    );

    const populatedCart = {
      _id: cart._id,
      user: cart.user,
      items: cartItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };

    return res.json({ cart: populatedCart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error al listar el carrito' });
  }
};

export const listAllCarts = async (req, res) => {
  try {
    const allCarts = await Cart.find()
      .populate('user', 'username')
      // .populate('items.product');
      .populate(
        'items.product',
        'name price category available imagen.secure_url description subcategory'
      );

    return res.json({ carts: allCarts });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar carritos' });
  }
};

export const addToCart = async (req, res) => {
  const { cart } = req;
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    existingItem
      ? (existingItem.quantity += quantity)
      : cart.items.push({ product: productId, quantity });
    req.user
      ? await Cart.findByIdAndUpdate(cart._id, { items: cart.items })
      : res.cookie('cart', JSON.stringify(cart.items));
    return res.json({ cart });
  } catch (error) {
    return res.status(500).json({ message: 'Error al agregar al carrito' });
  }
};

export const removeFromCart = async (req, res) => {
  const { cart } = req;
  const { productId } = req.params;
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  req.user
    ? await Cart.findByIdAndUpdate(cart._id, { items: cart.items })
    : res.cookie('cart', JSON.stringify(cart.items));
  return res.json({ cart });
};

export const updateItemQuantity = async (req, res) => {
  const { cart } = req;
  const { productId } = req.params;
  const { quantity } = req.body;
  const existingItem = cart.items.find((item) => item.product.toString() === productId);
  if (existingItem) existingItem.quantity = quantity;
  req.user
    ? await Cart.findByIdAndUpdate(cart._id, { items: cart.items })
    : res.cookie('cart', JSON.stringify(cart.items));
  return res.json({ cart });
};
