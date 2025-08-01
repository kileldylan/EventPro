const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = {
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
      }

      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          console.error('JWT verification error:', err);
          return res.status(401).json({ error: 'Invalid token' });
        }

        db.query(
          'SELECT * FROM Users WHERE User_ID = ?',
          [decoded.id],
          (error, results) => {
            if (error) {
              console.error('Database error:', error);
              return res.status(500).json({ error: 'Database error' });
            }
            if (results.length === 0) {
              return res.status(401).json({ error: 'User not found' });
            }

            req.user = results[0]; // attach full user to request
            next();
          }
        );
      });
    } catch (err) {
      console.error('Auth middleware error:', err);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  },

  verifyAdmin: (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    if (req.user.Role_ID !== 1) { // Replace 1 with correct admin role if different
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  }
};
