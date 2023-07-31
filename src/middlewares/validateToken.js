import jwt from 'jsonwebtoken';
import parseCartFromCookie from '../middlewares/cookieParser.js';
import Cart from '../models/cartModel.js';

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
    if (!decoded || !decoded.id || !decoded.role) {
      console.error('Invalid token payload:', decoded);
      return res.status(401).json({ message: 'Unauthorized - Invalid token payload' });
    }
    req.user = decoded;
    next();
  });
};

const enviarRespuestaError = (res, estado, mensaje) => {
  return res.status(estado).json({ mensaje });
};

const buscarOCrearCarrito = async (userId) => {
  if (!userId) {
    return { items: [] };
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

export const verificarTokenYBuscarCarrito = async (req, res, next) => {
  const { token } = req.cookies;
  const cartCookie = req.cookies.cart;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error(err);
        return enviarRespuestaError(res, 401, 'Unauthorized - Invalid token');
      }
      if (!decoded || !decoded.id || !decoded.role) {
        console.error('Invalid token payload:', decoded);
        return enviarRespuestaError(res, 401, 'Unauthorized - Invalid token payload');
      }
      req.user = decoded;
      req.cart = await buscarOCrearCarrito(decoded.id);
      next();
    });
  } else {
    req.cart = { items: parseCartFromCookie(cartCookie) };
    next();
  }
};

