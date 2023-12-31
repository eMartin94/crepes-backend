import jwt from 'jsonwebtoken';
import parseCartFromCookie from '../middlewares/cookieParser.js';
import Cart from '../models/cartModel.js';

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    if (!decoded || !decoded.id || !decoded.role)
      return res.status(401).json({ message: 'Unauthorized - Invalid token payload' });
    req.user = decoded;
    next();
  });
};

const sendErrorResponse = (res, status, message) => res.status(status).json({ message });

const searchCreateCart = async (userId) => {
  if (!userId) return { items: [] };
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

export const verifyTokenAndAdmin = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return sendErrorResponse(res, 401, 'Unauthorized - No token provided');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return sendErrorResponse(res, 401, 'Unauthorized - Invalid token');
    if (!decoded || !decoded.id || !decoded.role)
      return sendErrorResponse(res, 401, 'Unauthorized - Invalid token payload');
    if (decoded.role !== 'administrator')
      return sendErrorResponse(res, 403, 'Forbidden - Admin access required');
    req.user = decoded;
    next();
  });
};

function generateUniqueCartId() {
  const uniqueId = Math.random().toString(36).substr(2, 9);
  return `tempCart_${uniqueId}`;
}

export const verifyTokenAndFindCart = async (req, res, next) => {
  const { token } = req.cookies;
  const cartCookie = req.cookies.cart;
  let temporaryCartId = req.cookies.tempCartId;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return sendErrorResponse(res, 401, 'Unauthorized - Invalid token');
      if (!decoded || !decoded.id || !decoded.role)
        return sendErrorResponse(res, 401, 'Unauthorized - Invalid token payload');

      req.user = decoded;
      req.cart = await searchCreateCart(decoded.id);
      next();
    });
  } else {

    if (!temporaryCartId) {
      temporaryCartId = generateUniqueCartId();
      res.cookie('tempCartId', temporaryCartId);
    }

    req.cart = { _id: temporaryCartId, items: parseCartFromCookie(cartCookie) };
    next();
  }
};



