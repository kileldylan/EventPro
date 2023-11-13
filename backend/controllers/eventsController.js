const eventsModel = require("../models/eventsModel");

module.exports = {
  addVenue: async (req, res) => {
    const {
      venueName,
      street,
      city,
      district,
      state,
      pincode,
      capacity
    } = req.body;

    eventsModel.createVenue(
      venueName,
      street,
      city,
      district,
      state,
      pincode,
      capacity,
      (err) => {
        if (err && err.message === 'Venue with the same name already exists') {
          res.status(500).json({ error: 'Venue Already Exists' });
        }
        else if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(201).json({ message: 'Venue added successfully' });
        }
      }
    );
  },

  getAllVenues: (req, res) => {
    eventsModel.getAllVenues((err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  },

  addEvent: async (req, res) => {
    const {
      eventName,
      eventDate,
      venue,
      ticketsCount,
      ticketPrice,
      organizer
    } = req.body;

    const availabelTickets = ticketsCount;

    eventsModel.createEvent(
      eventName,
      eventDate,
      venue,
      ticketsCount,
      ticketPrice,
      organizer,
      availabelTickets,
      (err) => {
        if (err && err.message === 'Event with the same name already exists') {
          res.status(500).json({ error: 'Event Already Exists' });
        }
        else if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(201).json({ message: 'Event added successfully' });
        }
      }
    );
  },

  getAllEvents: (req, res) => {
    eventsModel.getAllEvents((err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  },

  getOneEvent: (req, res) => {
    const { eventId } = req.params;

    eventsModel.getOneEvent(eventId, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result[0]);
      }
    });
  },

  getOneVenue: (req, res) => {
    const { venueId } = req.params;

    eventsModel.getOneVenue(venueId, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result[0]);
      }
    });
  },

  deleteOneEvent: (req, res) => {
    const eventId = req.params.eventId;
  
    eventsModel.deleteEvent(eventId, (err, result) => {
      if (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Event deleted successfully' });
      }
    });
  },

  deleteOneVenue: (req, res) => {
    const venueId = req.params.venueId;
  
    eventsModel.deleteVenue(venueId, (err, result) => {
      if (err) {
        console.error('Error deleting venue:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Venue deleted successfully' });
      }
    });
  }
  
};
