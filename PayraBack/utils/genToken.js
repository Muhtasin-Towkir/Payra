import jwt from 'jsonwebtoken';

// The function now accepts the user's ID and role
const generateToken = (id, role) => {
  // We include both id and role in the token's payload
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default generateToken;