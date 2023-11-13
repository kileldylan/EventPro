const db = require("../db");

module.exports = {
  createBooking: (userID, eventID, callback) => {
    const query =
      "INSERT INTO Bookings (User_ID, Event_ID, Booking_Date) VALUES (?, ?, CURDATE())";
    db.query(query, [userID, eventID], callback);
  },

  createTickets: (eventID, numberOfTickets, callback) => {
    const query = "INSERT INTO Tickets (Event_ID) VALUES (?)";
    const ticketIDs = [];
    for (let i = 0; i < numberOfTickets; i++) {
      db.query(query, [eventID], (err, results) => {
        if (err) {
          return callback(err);
        }
        ticketIDs.push(results.insertId);
        if (ticketIDs.length == parseInt(numberOfTickets)) {
          callback(null, ticketIDs);
        }
      });
    }
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
  }
  
  
  
};
