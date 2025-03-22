import jwt from 'jsonwebtoken';
import User from '../models/client.js';
import Vendor from '../models/vendor.js';

const checkAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    
    // Check if the user is a Client or Vendor
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      user = await Vendor.findOne({ businessemail: decoded.email });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach the user object to the request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Authentication token expired' });
    }

    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default checkAuth;
