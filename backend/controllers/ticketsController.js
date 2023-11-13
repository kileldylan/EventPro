const ticketsModel = require("../models/ticketsModel.js");

module.exports = {
  createBooking: (req, res) => {
    const { userID, eventID } = req.body;

    ticketsModel.createBooking(userID, eventID, (err, bookingResults) => {
      if (err) {
        console.error("Error creating booking:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const bookingID = bookingResults.insertId;
      return res.status(200).json({ bookingID });
    });
  },

  createTickets: (req, res) => {
    const { eventID, numberOfTickets } = req.body;

    ticketsModel.createTickets(eventID, numberOfTickets, (err, ticketIDs) => {
      if (err) {
        console.error("Error creating tickets:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ ticketIDs });
    });
  },

  createBookingDetails: (req, res) => {
    const { bookingID, ticketIDs } = req.body;

    ticketsModel.createBookingDetails(bookingID, ticketIDs, (err) => {
      if (err) {
        console.error("Error creating booking details:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ message: "Booking details created successfully" });
    });
  },

  updateAvailableTickets: (req, res) => {
    const { eventID, numberOfTickets } = req.body;

    ticketsModel.updateAvailableTickets(eventID, numberOfTickets, (err) => {
      if (err) {
        console.error("Error updating available tickets:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ message: "Available tickets updated successfully" });
    });
  },

  createPayment: (req, res) => {
    const { bookingID, paymentMethod, amount } = req.body;

    ticketsModel.createPayment(bookingID, paymentMethod, amount, (err) => {
      if (err) {
        console.error("Error creating payment entry:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json({ message: "Payment entry created successfully" });
    });
  },
};
