import jwt from 'jsonwebtoken';
import User from '../models/client.js';
import Vendor from '../models/vendor.js';

export default async function checkAuth(req, res, next) {
  let token = req.header('Authorization');

  try {
    // Ensure token exists
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Remove "Bearer " prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    console.log('Decoded token:', decoded); // Debug log

    // First try to find a vendor (since we're fixing vendor reply functionality)
    let user = null;
    
    // Try to find vendor by ID first
    if (decoded.userId) {
      user = await Vendor.findById(decoded.userId);
    }
    
    // If not found, try by business email
    if (!user && decoded.email) {
      user = await Vendor.findOne({ businessemail: decoded.email });
    }
    
    // If still not found, check client models
    if (!user && decoded.userId) {
      user = await User.findById(decoded.userId);
    }
    
    if (!user && decoded.email) {
      user = await User.findOne({ email: decoded.email });
    }

    if (!user) {
      console.log('User not found with token data:', decoded); // Debug log
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request object with required properties
    req.user = {
      _id: user._id,
      role: user.role || (user.adminPrivileges ? 'ADMIN' : 'VENDOR'),
      email: user.email || user.businessemail
    };

    console.log('Authenticated user:', req.user); // Debug log
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Authentication token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    return res.status(401).json({ message: 'Authentication failed: ' + error.message });
  }
}