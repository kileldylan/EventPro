const eventsModel = require("../models/ticketsModel");

module.exports = {
  createBooking: (userID, eventID, callback) => {
    const query =
      "INSERT INTO Bookings (User_ID, Event_ID, Booking_Date) VALUES (?, ?, CURDATE())";
    db.query(query, [userID, eventID], callback);
  },

createTickets: (userID, eventID, quantity, callback) => {
    const ticketPriceQuery = "SELECT Ticket_Price FROM Events WHERE Event_ID = ?";
    db.query(ticketPriceQuery, [eventID], (err, results) => {
        if (err) return callback(err);
        
        const ticketPrice = results[0].Ticket_Price;
        const totalPrice = ticketPrice * quantity;
        
        db.query(
            "INSERT INTO Tickets (Event_ID, User_ID, Quantity, Total_Price) VALUES (?, ?, ?, ?)",
            [eventID, userID, quantity, totalPrice],
            callback
        );
    });
},

  createBookingDetails: async (bookingID, ticketIDs, callback) => {
    const query =
      "INSERT INTO BookingDetails (Booking_ID, Ticket_ID) VALUES (?, ?)";

    try {
      for (const ticketID of ticketIDs) {
        await new Promise((resolve, reject) => {
          db.query(query, [bookingID, ticketID], (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }

      callback(null);
    } catch (err) {
      callback(err);
    }
  },

  updateAvailableTickets: (eventID, numberOfTickets, callback) => {
    const query =
      "UPDATE Events SET Available_Tickets = Available_Tickets - ? WHERE Event_ID = ?";
    db.query(query, [numberOfTickets, eventID], callback);
  },

  createPayment: (bookingID, paymentMethod, amount, callback) => {
    const query =
      "INSERT INTO Payments (Booking_ID, Payment_Method, Amount, Payment_Status) VALUES (?, ?, ?, ?)";
    db.query(query, [bookingID, paymentMethod, amount, "Success"], callback);
  },

  getUserTickets: (userId, callback) => {
    const query = `
      SELECT
        Tickets.Ticket_ID,
        Events.Event_Name,
        Events.Ticket_Price,
        Events.Event_Date,
        Events.Event_Start_Time,
        Events.Event_End_Time,
        Events.Organizer,
        Venues.Venue_Name,
        Venues.Street,
        Venues.City,
        Venues.District,
        Venues.State,
        Venues.Pincode,
        Venues.Capacity,
        Bookings.Booking_ID,
        Bookings.Booking_Date,
        Payments.Payment_Method,
        Payments.Amount
      FROM Tickets
      JOIN BookingDetails ON Tickets.Ticket_ID = BookingDetails.Ticket_ID
      JOIN Bookings ON BookingDetails.Booking_ID = Bookings.Booking_ID
      JOIN Events ON Bookings.Event_ID = Events.Event_ID
      JOIN Venues ON Events.Venue_ID = Venues.Venue_ID
      LEFT JOIN Payments ON Bookings.Booking_ID = Payments.Booking_ID
      WHERE Bookings.User_ID = ?
    `;
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        return callback(err);
      }
  
      callback(null, results);
    });
  },

  getStatistics: (callback) => {
    const ticketQuery = `
      SELECT COUNT(DISTINCT Tickets.Ticket_ID) as totalTicketsSold
      FROM Payments 
      JOIN Bookings ON Payments.Booking_ID = Bookings.Booking_ID
      JOIN Tickets ON Bookings.Event_ID = Tickets.Event_ID;
    `;
  
    const revenueQuery = `SELECT SUM(Amount) as totalRevenue FROM Payments`;
  
    const eventWiseQuery = `
      SELECT 
        Events.Event_ID, 
        Events.Event_Name, 
        COUNT(Bookings.Booking_ID) as totalBookings,
        COUNT(DISTINCT Tickets.Ticket_ID) as totalTicketsSold, 
        SUM(Payments.Amount) as totalRevenue 
      FROM Events 
      LEFT JOIN Bookings ON Events.Event_ID = Bookings.Event_ID 
      LEFT JOIN Payments ON Bookings.Booking_ID = Payments.Booking_ID 
      LEFT JOIN Tickets ON Bookings.Event_ID = Tickets.Event_ID 
      GROUP BY Events.Event_ID
    `;
  
    db.query(ticketQuery, (err1, ticketStats) => {
      if (err1) {
        return callback(err1, null);
      }
  
      db.query(revenueQuery, (err2, revenueStats) => {
        if (err2) {
          return callback(err2, null);
        }
  
        db.query(eventWiseQuery, (err3, eventWiseStats) => {
          if (err3) {
            return callback(err3, null);
          }
  
          const totalStats = {
            totalTicketsSold: ticketStats[0].totalTicketsSold,
            totalRevenue: revenueStats[0].totalRevenue,
          };
  
          callback(null, { totalStats, eventWiseStats });
        });
      });
    });
  },
  
  purchaseTicket: async (req, res) => {
    const { userID, eventID, numberOfTickets, paymentMethod, amount } = req.body;

    try {
      // Start transaction
      await db.query('START TRANSACTION');

      // 1. Create booking
      const [booking] = await db.query(
        "INSERT INTO Bookings (User_ID, Event_ID, Booking_Date) VALUES (?, ?, CURDATE())",
        [userID, eventID]
      );

      const bookingID = booking.insertId;

      // 2. Create tickets
      const ticketIDs = [];
      for (let i = 0; i < numberOfTickets; i++) {
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
        [numberOfTickets, eventID]
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

      res.status(200).json({ 
        message: "Ticket purchase successful. Payment pending verification." 
      });
    } catch (error) {
      // Rollback on error
      await db.query('ROLLBACK');
      console.error("Error purchasing ticket:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  verifyPayment: async (req, res) => {
    const { paymentID } = req.params;
    const { status, notes } = req.body;
    const adminID = req.user.id; // Assuming admin is authenticated

    try {
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

      res.status(200).json({ message: "Payment verification updated" });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllPayments: async (req, res) => {
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
        ORDER BY p.Payment_Date DESC
      `);

      res.status(200).json({ payments });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  
};
