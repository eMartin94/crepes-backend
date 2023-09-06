import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { crearTokenAcceso } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(404).json(['El usuario ya existe']);
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: passwordHash,
      username,
      role: 'customer',
    });
    const userSaved = await newUser.save();
    const token = await crearTokenAcceso({ id: userSaved._id });
    res.cookie('token', token);
    res.json({
      id: userSaved._id,
      email: userSaved.email,
      username: userSaved.username,
      role: userSaved.role,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(404).json({ message: 'Usuario no encontrado' });
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(404).json({ message: 'Contraseña incorrecta' });
    const token = await crearTokenAcceso({
      id: userFound._id,
      username: userFound.username,
      role: userFound.role,
    });
    res.cookie('token', token);
    res.json({
      id: userFound._id,
      email: userFound.email,
      username: userFound.username,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound)
    return res.status(404).json({ message: 'Usuario no encontrado' });
  return res.json({
    id: userFound._id,
    email: userFound.email,
    username: userFound.username,
    role: userFound.role,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

export const createAdministrator = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(404).json({ message: 'El usuario ya existe' });
    const passwordHash = await bcrypt.hash(password, 10);
    const newAdministrator = new User({
      email,
      password: passwordHash,
      username,
      role: 'administrator',
    });
    const administratorSaved = await newAdministrator.save();
    const token = await crearTokenAcceso({ id: administratorSaved._id });
    res.cookie('token', token);
    res.json({
      id: administratorSaved._id,
      email: administratorSaved.email,
      username: administratorSaved.username,
      role: administratorSaved.role,
      createdAt: administratorSaved.createdAt,
      updatedAt: administratorSaved.updatedAt,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(401);
    const userFound = await User.findById(decoded.id);
    if (!userFound) return res.sendStatus(401);
    return res.json({
      id: userFound._id,
      email: userFound.email,
      username: userFound.username,
      role: userFound.role,
    });
  });
};
