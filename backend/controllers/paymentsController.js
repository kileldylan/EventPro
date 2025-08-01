const db = require('../db');

module.exports = {
  initiatePayment: async (req, res) => {
    const { userID, eventID, quantity, paymentMethod, amount } = req.body;

    try {
      // Start transaction
      await db.query('START TRANSACTION');

      // 1. Create booking
      const [booking] = await db.query(
        "INSERT INTO Bookings (User_ID, Event_ID) VALUES (?, ?)",
        [userID, eventID]
      );
      const bookingID = booking.insertId;

      // 2. Create tickets
      const ticketIDs = [];
      for (let i = 0; i < quantity; i++) {
        const [ticket] = await db.query(
          "INSERT INTO Tickets (Event_ID) VALUES (?)",
          [eventID]
        );
        ticketIDs.push(ticket.insertId);
      }

      // 3. Create booking details
      for (const ticketID of ticketIDs) {
        await db.query(
          "INSERT INTO BookingDetails (Booking_ID, Ticket_ID) VALUES (?, ?)",
          [bookingID, ticketID]
        );
      }

      // 4. Update available tickets
      await db.query(
        "UPDATE Events SET Available_Tickets = Available_Tickets - ? WHERE Event_ID = ?",
        [quantity, eventID]
      );

      // 5. Create payment (with pending status)
      await db.query(
        `INSERT INTO Payments (
          Booking_ID, 
          Payment_Method, 
          Amount, 
          Payment_Status,
          Verification_Status
        ) VALUES (?, ?, ?, ?, ?)`,
        [bookingID, paymentMethod, amount, "Success", "Pending"]
      );

      // Commit transaction
      await db.query('COMMIT');

      res.status(201).json({ 
        message: "Payment initiated successfully. Ticket pending verification." 
      });
    } catch (error) {
      // Rollback on error
      await db.query('ROLLBACK');
      console.error("Error initiating payment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  verifyPayment: async (req, res) => {
    const { paymentID } = req.params;
    const { status, notes } = req.body;
    const adminID = req.user.id; // Assuming admin is authenticated

    try {
      // Start transaction
      await db.query('START TRANSACTION');

      // 1. Update payment verification status
      await db.query(
        `UPDATE Payments 
        SET 
          Verification_Status = ?,
          Verification_Date = NOW(),
          Verified_By = ?,
          Verification_Notes = ?
        WHERE Payment_ID = ?`,
        [status, adminID, notes, paymentID]
      );

      // 2. Update associated tickets status
      const ticketStatus = status === 'Verified' ? 'Confirmed' : 'Cancelled';
      await db.query(
        `UPDATE Tickets t
        JOIN BookingDetails bd ON t.Ticket_ID = bd.Ticket_ID
        JOIN Bookings b ON bd.Booking_ID = b.Booking_ID
        JOIN Payments p ON b.Booking_ID = p.Booking_ID
        SET t.Status = ?
        WHERE p.Payment_ID = ?`,
        [ticketStatus, paymentID]
      );

      // Commit transaction
      await db.query('COMMIT');

      res.status(200).json({ message: "Payment verification updated" });
    } catch (error) {
      // Rollback on error
      await db.query('ROLLBACK');
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getPendingPayments: async (req, res) => {
    try {
      const [payments] = await db.query(`
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
        WHERE p.Verification_Status = 'Pending'
        ORDER BY p.Payment_Date DESC
      `);

      res.status(200).json({ payments });
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getPaymentDetails: async (req, res) => {
    const { paymentID } = req.params;
    
    try {
      const [payment] = await db.query(`
        SELECT 
          p.*,
          b.User_ID,
          u.Name AS User_Name,
          u.Email AS User_Email,
          e.Event_Name,
          e.Event_ID,
          GROUP_CONCAT(t.Ticket_ID) AS Ticket_IDs
        FROM Payments p
        JOIN Bookings b ON p.Booking_ID = b.Booking_ID
        JOIN Users u ON b.User_ID = u.User_ID
        JOIN Events e ON b.Event_ID = e.Event_ID
        JOIN BookingDetails bd ON b.Booking_ID = bd.Booking_ID
        JOIN Tickets t ON bd.Ticket_ID = t.Ticket_ID
        WHERE p.Payment_ID = ?
        GROUP BY p.Payment_ID
      `, [paymentID]);

      if (payment.length === 0) {
        return res.status(404).json({ error: "Payment not found" });
      }

      res.status(200).json({ payment: payment[0] });
    } catch (error) {
      console.error("Error fetching payment details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getUserPayments: async (req, res) => {
    const { userID } = req.params;
    
    try {
      const [payments] = await db.query(`
        SELECT 
          p.*,
          e.Event_Name,
          e.Event_ID
        FROM Payments p
        JOIN Bookings b ON p.Booking_ID = b.Booking_ID
        JOIN Events e ON b.Event_ID = e.Event_ID
        WHERE b.User_ID = ?
        ORDER BY p.Payment_Date DESC
      `, [userID]);

      res.status(200).json({ payments });
    } catch (error) {
      console.error("Error fetching user payments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};