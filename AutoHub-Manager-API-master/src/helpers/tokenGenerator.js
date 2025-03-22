import jwt from 'jsonwebtoken';

// Function to create a JWT token with user information
const generateToken = (user) => {
  // Determine if user is a client or vendor based on available fields
  const isVendor = user.businessemail !== undefined;
  
  const payload = {
    // Use appropriate email field based on user type
    email: isVendor ? user.businessemail : user.email,
    userId: user._id, // Consistently use userId
    role: user.role // Include role for authorization checks
  };
  
  const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key_here';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export default generateToken;