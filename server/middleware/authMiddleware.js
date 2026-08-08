/**
 * Authentication Middleware
 * Protects endpoints using Bearer JWT or HTTP-only cookies.
 */

const { verifyToken } = require('../config/jwt');

function authenticateToken(req, res, next) {
  let token = null;

  // Check Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please login to continue."
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired session token. Please login again."
    });
  }

  req.user = decoded;
  next();
}

module.exports = {
  authenticateToken
};
