const ticketsModel = require("../models/ticketsModel.js");

module.exports = {
  purchaseTicket: (req, res) => {
    const { userID, eventID, numberOfTickets, paymentMethod, amount } = req.body;

    ticketsModel.createBooking(userID, eventID, (bookingErr, bookingResults) => {
      if (bookingErr) {
        console.error("Error purchasing ticket:", bookingErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const bookingID = bookingResults.insertId;

      ticketsModel.createTickets(eventID, numberOfTickets, (ticketErr, ticketIDs) => {
        if (ticketErr) {
          console.error("Error creating tickets:", ticketErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        ticketsModel.createBookingDetails(bookingID, ticketIDs, (detailsErr) => {
          if (detailsErr) {
            console.error("Error creating booking details:", detailsErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          ticketsModel.updateAvailableTickets(eventID, numberOfTickets, (updateErr) => {
              if (updateErr) {
                console.error("Error updating available tickets:", updateErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              ticketsModel.createPayment(bookingID, paymentMethod, amount, (paymentErr) => {
                if (paymentErr) {
                  console.error("Error creating payment entry:", paymentErr);
                  return res
                    .status(500).json({ error: "Internal Server Error" });
                }

                return res
                  .status(200).json({ message: "Ticket purchased successfully" });
              });
            }
          );
        });
      });
    });
  },
};
