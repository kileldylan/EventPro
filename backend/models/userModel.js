const db = require('../db');

module.exports = {
  loginUser: (email, callback) => {
    const query = `
      SELECT 
        u.User_ID, u.Username, u.Name, u.Email, 
        u.Password, u.Role_ID, u.ContactInfo,
        r.Role_Name
      FROM Users u
      JOIN UserRoles r ON u.Role_ID = r.Role_ID
      WHERE u.Email = ?`;
    db.query(query, [email], callback);
  },

  createUser: (userData, callback) => {
    // First check if username or email exists
    const checkQuery = `
      SELECT COUNT(*) AS count 
      FROM Users 
      WHERE Username = ? OR Email = ?
    `;
    
    db.query(checkQuery, [userData.username, userData.email], (err, results) => {
      if (err) return callback(err);
      
      if (results[0].count > 0) {
        return callback(new Error('Username or email already exists'));
      }

      // Insert new user
      const insertQuery = `
        INSERT INTO Users 
        (Name, Email, Username, Password, Role_ID, ContactInfo) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      db.query(insertQuery, [
        userData.name,
        userData.email,
        userData.username,
        userData.password,
        userData.role,
        userData.contactInfo
      ], callback);
    });
  },

  checkEmail: (email, callback) => {
    const query = 'SELECT COUNT(*) AS count FROM Users WHERE Email = ?';
    db.query(query, [email], callback);
  },

  checkUsername: (username, callback) => {
    const query = 'SELECT COUNT(*) AS count FROM Users WHERE Username = ?';
    db.query(query, [username], callback);
  },

  getUserDetails: (userId, callback) => {
    const query = `
      SELECT 
        u.User_ID, u.Name, u.Username, u.Email, 
        u.ContactInfo, u.Role_ID, r.Role_Name
      FROM Users u
      JOIN UserRoles r ON u.Role_ID = r.Role_ID
      WHERE u.User_ID = ?`;
    db.query(query, [userId], callback);
  },

  updateUser: (userId, userData, callback) => {
    const query = `
      UPDATE Users 
      SET Name = ?, Email = ?, ContactInfo = ?
      WHERE User_ID = ?`;
    db.query(query, [
      userData.name,
      userData.email,
      userData.contactInfo,
      userId
    ], callback);
  },

  createPayment: (bookingID, paymentMethod, amount, callback) => {
    const query = `
      INSERT INTO Payments (
        Booking_ID, 
        Payment_Method, 
        Amount, 
        Payment_Status,
        Verification_Status
      ) VALUES (?, ?, ?, ?, ?)`;
    db.query(
      query, 
      [bookingID, paymentMethod, amount, "Success", "Pending"], 
      callback
    );
  },

  verifyPayment: (paymentID, adminID, status, notes, callback) => {
    const query = `
      UPDATE Payments 
      SET 
        Verification_Status = ?,
        Verification_Date = NOW(),
        Verified_By = ?,
        Verification_Notes = ?
      WHERE Payment_ID = ?`;
    db.query(query, [status, adminID, notes, paymentID], callback);
  },

  getAllPayments: (callback) => {
    const query = `
      SELECT 
        p.*,
        b.User_ID,
        u.Name AS User_Name,
        u.Email AS User_Email,
        e.Event_Name,
        e.Event_ID
      FROM Payments p
      JOIN Bookings b ON p.Booking_ID = b.Booking_ID
      JOIN Users u ON b.User_ID = u.User_ID
      JOIN Events e ON b.Event_ID = e.Event_ID
      ORDER BY p.Payment_Date DESC`;
    db.query(query, callback);
  },

  getUserPayments: (userID, callback) => {
    const query = `
      SELECT 
        p.*,
        e.Event_Name,
        e.Event_Date
      FROM Payments p
      JOIN Bookings b ON p.Booking_ID = b.Booking_ID
      JOIN Events e ON b.Event_ID = e.Event_ID
      WHERE b.User_ID = ?
      ORDER BY p.Payment_Date DESC`;
    db.query(query, [userID], callback);
  }
};