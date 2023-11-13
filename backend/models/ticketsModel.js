const db = require("../db");

module.exports = {
  createBooking: (userID, eventID, callback) => {
    const query = "INSERT INTO Bookings (User_ID, Event_ID, Booking_Date) VALUES (?, ?, CURDATE())";
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
    const query = "INSERT INTO BookingDetails (Booking_ID, Ticket_ID) VALUES (?, ?)";
  
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
    const query = "UPDATE Events SET Available_Tickets = Available_Tickets - ? WHERE Event_ID = ?";
    db.query(query, [numberOfTickets, eventID], callback);
  },

  createPayment: (bookingID, paymentMethod, amount, callback) => {
    const query = "INSERT INTO Payments (Booking_ID, Payment_Method, Amount, Payment_Status) VALUES (?, ?, ?, ?)";
    db.query(query, [bookingID, paymentMethod, amount, "Success"], callback);
  },
};
