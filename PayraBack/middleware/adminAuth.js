const adminOnly = (req, res, next) => {
  // We check req.user because the 'protect' middleware should have run first
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403); // 403 Forbidden
    throw new Error('Not authorized as an admin');
  }
};

export { adminOnly };