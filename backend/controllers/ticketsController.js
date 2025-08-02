const db = require('../db');
const ticketsModel = require("../models/ticketsModel");

module.exports = {
  // Purchase ticket endpoint
  purchaseTicket: (req, res) => {
    const { userID, eventID, numberOfTickets, paymentMethod, amount } = req.body;

    db.beginTransaction(err => {
      if (err) return res.status(500).json({ error: "Transaction Error" });

      // 1. Create booking
      ticketsModel.createBooking(userID, eventID, (err, bookingResult) => {
        if (err) return db.rollback(() => res.status(500).json({ error: "Booking Error" }));

        const bookingID = bookingResult.insertId;

        // 2. Create tickets
        ticketsModel.createTickets(userID, eventID, numberOfTickets, (err, ticketResult) => {
          if (err) return db.rollback(() => res.status(500).json({ error: "Ticket Creation Error" }));

          const ticketID = ticketResult.insertId;

          // 3. Create booking details
          ticketsModel.createBookingDetails(bookingID, ticketID, err => {
            if (err) return db.rollback(() => res.status(500).json({ error: "Booking Details Error" }));

            // 4. Update available tickets
            ticketsModel.updateAvailableTickets(eventID, numberOfTickets, err => {
              if (err) return db.rollback(() => res.status(500).json({ error: "Ticket Update Error" }));

              // 5. Create payment record
              ticketsModel.createPayment(bookingID, paymentMethod, amount, err => {
                if (err) return db.rollback(() => res.status(500).json({ error: "Payment Error" }));

                db.commit(err => {
                  if (err) return db.rollback(() => res.status(500).json({ error: "Commit Error" }));

                  res.status(200).json({ 
                    message: "Ticket purchase successful",
                    bookingID,
                    ticketID
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  // Verify payment endpoint
  verifyPayment: (req, res) => {
    const { paymentID } = req.params;
    const { status, notes } = req.body;
    const adminID = req.user?.id;

    const query = `
      UPDATE Payments 
      SET 
        Verification_Status = ?,
        Verification_Date = NOW(),
        Verified_By = ?,
        Verification_Notes = ?
      WHERE Payment_ID = ?
    `;

    db.query(query, [status, adminID, notes, paymentID], (err) => {
      if (err) {
        console.error("Error verifying payment:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json({ message: "Payment verification updated" });
    });
  },

  // Get all payments for admin
getAllPayments: (req, res) => {
  const query = `
    SELECT 
      p.Payment_ID,
      p.Booking_ID,
      p.Payment_Method,
      p.Amount,
      p.Payment_Status,
      p.Verification_Status,
      DATE_FORMAT(p.Payment_Date, '%Y-%m-%d %H:%i:%s') AS Payment_Date,
      p.Verification_Date,
      p.Verified_By,
      p.Verification_Notes,
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

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching payments:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json({ payments: results });
    });
  },

  // Get user tickets
  getUserTickets: (req, res) => {
    const { userId } = req.params;

    ticketsModel.getUserTickets(userId, (err, tickets) => {
      if (err) {
        console.error("Error fetching tickets:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json(tickets); // Directly return array
    });
  },

  // Get statistics
  getStatistics: (req, res) => {
    ticketsModel.getStatistics((err, statistics) => {
      if (err) {
        console.error('Error calculating statistics:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.status(200).json(statistics);
    });
  }
};