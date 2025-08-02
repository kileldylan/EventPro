const db = require('../db');

module.exports = {
  getAllPayments: (callback) => {
    const query = `
      SELECT 
        p.Payment_ID,
        p.Payment_Method,
        p.Amount,
        p.Payment_Status,
        p.Verification_Status,
        p.Payment_Date,
        b.Booking_ID,
        u.User_ID,
        u.Name AS User_Name,
        u.Email,
        e.Event_ID,
        e.Event_Name
      FROM Payments p
      JOIN Bookings b ON p.Booking_ID = b.Booking_ID
      JOIN Users u ON b.User_ID = u.User_ID
      JOIN Events e ON b.Event_ID = e.Event_ID
      ORDER BY p.Payment_Date DESC
    `;
    db.query(query, callback);
  },

  refundPayment: (paymentId, callback) => {
    const query = `
      UPDATE Payments 
      SET 
        Payment_Status = 'Refunded',
        Verification_Status = 'Verified'
      WHERE Payment_ID = ?
    `;
    db.query(query, [paymentId], callback);
  },

  getPaymentDetails: (paymentId, callback) => {
    const query = `
      SELECT 
        p.*,
        u.Name AS User_Name,
        u.Email,
        e.Event_Name
      FROM Payments p
      JOIN Bookings b ON p.Booking_ID = b.Booking_ID
      JOIN Users u ON b.User_ID = u.User_ID
      LEFT JOIN Events e ON b.Event_ID = e.Event_ID
      WHERE p.Payment_ID = ?
    `;
    db.query(query, [paymentId], callback);
  }
};