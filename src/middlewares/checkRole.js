const validarRol = (roles) => (req, res, next) => {
  // console.log('Usuario autenticado:', req.user);
  const { role } = req.user || {};
  // console.log('Roles del usuario:', role);
  if (!roles.includes(role)) {
    console.log('Acceso denegado. Roles permitidos:', roles);
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
};

export default validarRol;