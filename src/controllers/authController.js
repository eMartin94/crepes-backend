import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { createAccessToken } from '../libs/jwt.js';

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: passwordHash, username, role: 'customer' });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id })

    res.cookie('token', token)
    res.json({
      id: userSaved._id,
      email: userSaved.email,
      username: userSaved.username,
      role: userSaved.role,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });

    console.log(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) return res.status(404).json({ message: 'Password incorrect' });

    const token = await createAccessToken({ id: userFound._id, role: userFound.role })

    res.cookie('token', token)
    res.json({
      id: userFound._id,
      email: userFound.email,
      username: userFound.username,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });

    console.log(userFound);


  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

export const logout = async (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0),
  })
  // res.json({ message: 'Logout successfully' })
  return res.sendStatus(200);
}

export const profile = async (req, res) => {
  console.log(req.user.id);
  const userFound = await User.findById(req.user.id)

  if (!userFound) return res.status(404).json({ message: 'User not found' });

  return res.json({
    id: userFound._id,
    email: userFound.email,
    username: userFound.username,
    role: userFound.role,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  })
  // res.send('profile')
}


export const createAdministrator = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdministrator = new User({ email, password: passwordHash, username, role: "administrator" });
    const administratorSaved = await newAdministrator.save();
    const token = await createAccessToken({ id: administratorSaved._id })
    res.cookie('token', token)
    res.json({
      id: administratorSaved._id,
      email: administratorSaved.email,
      username: administratorSaved.username,
      role: administratorSaved.role,
      createdAt: administratorSaved.createdAt,
      updatedAt: administratorSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};
