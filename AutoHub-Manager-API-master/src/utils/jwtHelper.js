export const parseJwt = (token) => {
  try {
    if (!token) {
      console.warn('No token provided');
      return { isValid: false, error: 'Token is required' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid token structure');
      return { isValid: false, error: 'Invalid token format' };
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    const decoded = JSON.parse(jsonPayload);

    console.log('Full decoded token payload:', decoded);

    // Validate token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return { isValid: false, error: 'Token has expired' };
    }

    // Check all possible user identifier fields
    const possibleUserFields = ['userId', 'id', 'sub', 'user_id', '_id'];
    const userId = possibleUserFields.map(field => decoded[field]).find(id => id);

    if (!userId) {
      const availableFields = Object.keys(decoded).join(', ');
      console.warn(`Available token fields: ${availableFields}`);
      return { 
        isValid: false, 
        error: 'Missing user identifier',
        availableFields,
        decoded
      };
    }

    return {
      isValid: true,
      userId,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp,
      role: decoded.role,
      decoded
    };

  } catch (error) {
    console.error('JWT parsing error:', error);
    return {
      isValid: false,
      error: error.message,
      originalError: error
    };
  }
};