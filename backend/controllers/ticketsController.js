const db = require('../db');
const ticketsModel = require("../models/ticketsModel.js");

module.exports = {
  purchaseTicket: (req, res) => {
    const { userID, eventID, numberOfTickets, paymentMethod, amount } = req.body;

    db.beginTransaction((err) => {
      if (err) {
        console.error("Transaction Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      db.query(
        "INSERT INTO Bookings (User_ID, Event_ID, Booking_Date) VALUES (?, ?, CURDATE())",
        [userID, eventID],
        (err, bookingResult) => {
          if (err) return db.rollback(() => res.status(500).json({ error: "Booking Error" }));

          const bookingID = bookingResult.insertId;

          db.query(
            "INSERT INTO Tickets (Event_ID, User_ID, Quantity, Total_Price) VALUES (?, ?, ?, ?)",
            [eventID, userID, numberOfTickets, amount],
            (err, ticketResult) => {
              if (err) return db.rollback(() => res.status(500).json({ error: "Ticket Error" }));

              const ticketID = ticketResult.insertId;

              db.query(
                "INSERT INTO BookingDetails (Booking_ID, Ticket_ID) VALUES (?, ?)",
                [bookingID, ticketID],
                (err) => {
                  if (err) return db.rollback(() => res.status(500).json({ error: "BookingDetails Error" }));

                  db.query(
                    "UPDATE Events SET Available_Tickets = Available_Tickets - ? WHERE Event_ID = ?",
                    [numberOfTickets, eventID],
                    (err) => {
                      if (err) return db.rollback(() => res.status(500).json({ error: "Update Event Error" }));

                      db.query(
                        `INSERT INTO Payments (
                          Booking_ID, 
                          Payment_Method, 
                          Amount, 
                          Payment_Status,
                          Verification_Status
                        ) VALUES (?, ?, ?, ?, ?)`,
                        [bookingID, paymentMethod, amount, "Success", "Pending"],
                        (err) => {
                          if (err) return db.rollback(() => res.status(500).json({ error: "Payment Error" }));

                          db.commit((err) => {
                            if (err) return db.rollback(() => res.status(500).json({ error: "Commit Error" }));

                            res.status(200).json({
                              message: "Ticket purchase successful. Payment pending verification.",
                              bookingID,
                              ticketID
                            });
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
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
  
  getUserTickets: (req, res) => {
    const { userId } = req.params;

    ticketsModel.getUserTickets(userId, (err, tickets) => {
      if (err) {
        console.error("Error retrieving user tickets:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ tickets });
    });
  },

  getStatistics: (req, res) => {
    ticketsModel.getStatistics((err, statistics) => {
      if (err) {
        console.error('Error calculating statistics:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      res.json(statistics);
    });
  }
};
