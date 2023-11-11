const db = require('../db');

module.exports = {
  loginUser: (username, callback) => {
    const query = 'SELECT * FROM Users WHERE Email = ?';
    db.query(query, [username], callback);
  },

  createUser: (name, email, username, password, role, contactInfo, callback) => {
    const query = 'INSERT INTO Users (Name, Email, Username, Password, Role_ID, ContactInfo) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, email, username, password, role, contactInfo], callback);
  },

  checkEmail: (email, callback) => {
    const query = 'SELECT COUNT(*) AS count FROM Users WHERE Email = ?';
    db.query(query, [email], callback);
  },

  checkUsername: (username, callback) => {
    const query = 'SELECT COUNT(*) AS count FROM Users WHERE Username = ?';
    db.query(query, [username], callback);
  },

  getUserDetails: (username, callback) => {
    const query = 'SELECT User_ID, Name, Username, Email, ContactInfo, Role_ID FROM Users WHERE Username = ?';
    db.query(query, [username], callback);
  },
};
