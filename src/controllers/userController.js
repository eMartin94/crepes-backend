import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { crearTokenAcceso } from '../libs/jwt.js';
import { usuarioSchema } from '../schemas/userSchema.js';

export const listarUsuarios = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const obtenerUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    const userFound = await User.findById(userId);
    if (!userFound) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(userFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const crearUsuario = async (req, res) => {
  try {
    const { email, password, username, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const campoUsuario = { email, password: passwordHash, username, role };
    const validarCampos = usuarioSchema.parse(campoUsuario);
    const newUser = new User({ ...validarCampos });
    const existeUsuario = await User.findOne({ email: validarCampos.email });
    if (existeUsuario) return res.status(400).json({ message: 'El usuario ya existe' });

    // const newUser = new User({ email, password: passwordHash, username, role });
    // console.log(newUser);
    const userSaved = await newUser.save();
    return res.json({
      id: userSaved._id,
      email: userSaved.email,
      username: userSaved.username,
      role: userSaved.role,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    return res.status(400).json(error.errors.map((error) => error.message));
  }
};

export const actualizarRolUsuario = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.role = role;
    await user.save();

    return res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error al actualizar el rol del usuario' });
  }
};