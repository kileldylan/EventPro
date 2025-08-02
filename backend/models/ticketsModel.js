const db = require('../db');

module.exports = {
  // Create a new booking
  createBooking: (userID, eventID, callback) => {
    const query = "INSERT INTO Bookings (User_ID, Event_ID, Booking_Date) VALUES (?, ?, CURDATE())";
    db.query(query, [userID, eventID], callback);
  },

  createTickets: (userID, eventID, quantity, callback) => {
    const ticketPriceQuery = "SELECT Ticket_Price FROM Events WHERE Event_ID = ?";
    db.query(ticketPriceQuery, [eventID], (err, results) => {
      if (err) return callback(err);
      
      const ticketPrice = results[0]?.Ticket_Price || 0;
      const totalPrice = ticketPrice * quantity;
      
      const query = "INSERT INTO Tickets (Event_ID, User_ID, Quantity, Total_Price, Status) VALUES (?, ?, ?, ?, ?)";
      db.query(query, [eventID, userID, quantity, totalPrice, 'Pending'], callback);
    });
  },
  // Create booking details
  createBookingDetails: (bookingID, ticketID, callback) => {
    const query = "INSERT INTO BookingDetails (Booking_ID, Ticket_ID) VALUES (?, ?)";
    db.query(query, [bookingID, ticketID], callback);
  },

  // Update available tickets
  updateAvailableTickets: (eventID, quantity, callback) => {
    const query = "UPDATE Events SET Available_Tickets = Available_Tickets - ? WHERE Event_ID = ?";
    db.query(query, [quantity, eventID], callback);
  },

  // Create payment record
  createPayment: (bookingID, paymentMethod, amount, callback) => {
    const query = `
      INSERT INTO Payments (
        Booking_ID, 
        Payment_Method, 
        Amount, 
        Payment_Status,
        Verification_Status,
        Payment_Date
      ) VALUES (?, ?, ?, 'Success', 'Pending', NOW())
    `;
    db.query(query, [bookingID, paymentMethod, amount], callback);
  },
  // Get user tickets with all related information
    getUserTickets: (userId, callback) => {
    const query = `
      SELECT
        t.Ticket_ID,
        e.Event_Name,
        e.Event_Date,
        e.Event_Start_Time,
        e.Event_End_Time,
        v.Venue_Name,
        t.Quantity,
        t.Total_Price,
        t.Status,
        p.Payment_Method,
        p.Payment_Status,
        p.Verification_Status,
        b.Booking_Date AS Purchase_Date
      FROM Tickets t
      JOIN Bookings b ON t.User_ID = b.User_ID AND t.Event_ID = b.Event_ID
      JOIN Events e ON t.Event_ID = e.Event_ID
      JOIN Venues v ON e.Venue_ID = v.Venue_ID
      LEFT JOIN Payments p ON b.Booking_ID = p.Booking_ID
      WHERE t.User_ID = ?
      ORDER BY b.Booking_Date DESC
    `;
    
    db.query(query, [userId], (err, results) => {
      if (err) return callback(err);
      
      // Format dates for frontend
      const formattedTickets = results.map(ticket => ({
        ...ticket,
        Event_Date: ticket.Event_Date ? new Date(ticket.Event_Date).toISOString().split('T')[0] : null,
        Purchase_Date: ticket.Purchase_Date ? new Date(ticket.Purchase_Date).toISOString().split('T')[0] : null
      }));
      
      callback(null, formattedTickets);
    });
  },
  // Get statistics for admin dashboard
  getStatistics: (callback) => {
    const queries = {
      ticketStats: "SELECT COUNT(*) as totalTicketsSold FROM Tickets",
      revenueStats: "SELECT SUM(Amount) as totalRevenue FROM Payments WHERE Verification_Status = 'Verified'",
      eventStats: `
        SELECT 
          e.Event_ID, 
          e.Event_Name, 
          COUNT(t.Ticket_ID) as ticketsSold,
          SUM(p.Amount) as revenue
        FROM Events e
        LEFT JOIN Tickets t ON e.Event_ID = t.Event_ID
        LEFT JOIN Bookings b ON t.User_ID = b.User_ID
        LEFT JOIN Payments p ON b.Booking_ID = p.Booking_ID
        WHERE p.Verification_Status = 'Verified' OR p.Verification_Status IS NULL
        GROUP BY e.Event_ID
      `
    };

    db.query(queries.ticketStats, (err1, ticketStats) => {
      if (err1) return callback(err1);
      
      db.query(queries.revenueStats, (err2, revenueStats) => {
        if (err2) return callback(err2);
        
        db.query(queries.eventStats, (err3, eventStats) => {
          if (err3) return callback(err3);
          
          callback(null, {
            totalTickets: ticketStats[0].totalTicketsSold,
            totalRevenue: revenueStats[0].totalRevenue || 0,
            events: eventStats
          });
        });
      });
    });
  }
};