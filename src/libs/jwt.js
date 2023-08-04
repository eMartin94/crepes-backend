import jwt from 'jsonwebtoken';
export const crearTokenAcceso = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  })
}
