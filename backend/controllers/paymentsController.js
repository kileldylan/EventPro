// controllers/paymentsController.js
const paymentsModel = require("../models/paymentsModel");

module.exports = {
  getAllPayments: (req, res) => {
    paymentsModel.getAllPayments((err, result) => {
      if (err) {
        console.error("Error fetching payments:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  },

  getPaymentDetails: (req, res) => {
    const { paymentId } = req.params;

    paymentsModel.getPaymentDetails(paymentId, (err, result) => {
      if (err) {
        console.error("Error fetching payment details:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result[0]);
      }
    });
  },

  refundPayment: (req, res) => {
    const { paymentId } = req.params;

    paymentsModel.refundPayment(paymentId, (err, result) => {
      if (err) {
        console.error("Error refunding payment:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Payment refunded successfully" });
      }
    });
  }
};