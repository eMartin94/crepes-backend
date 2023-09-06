import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { userValidationSchema } from '../schemas/userSchema.js';

export const listUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const userFound = await User.findById(userId);
    if (!userFound)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    return res.json(userFound);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, username, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const inputUser = { email, password: passwordHash, username, role };
    const validateInput = userValidationSchema.parse(inputUser);
    const newUser = new User({ ...validateInput });

    const existingUser = await User.findOne({ email: validateInput.email });
    if (existingUser)
      return res.status(404).json({ message: 'El usuario ya existe' });

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
    return res.status(404).json(error.errors.map((error) => error.message));
  }
};

export const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

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
    return res
      .status(500)
      .json({ message: 'Error al actualizar el rol del usuario' });
  }
};
