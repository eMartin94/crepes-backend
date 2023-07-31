const checkRole = (roles) => (req, res, next) => {
  const { role } = req.user || {};
  console.log(role);

  if (!roles.includes(role)) {
    return res.status(403).json({ message: 'Forbidden - Access Denied' });
  }

  next();
};

export default checkRole;