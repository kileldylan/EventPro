const eventsModel = require("../models/eventsModel");

module.exports = {
  addEvent: async (req, res) => {
    try {
      const {
        Event_Name,
        Event_Date,
        Event_Start_Time,
        Event_End_Time,
        Venue_ID,
        Tickets_Count,
        Ticket_Price,
        Organizer,
        Available_Tickets
      } = req.body;

      // Validate required fields
      if (!Event_Name || !Event_Date || !Venue_ID || !Event_Start_Time || !Event_End_Time || !Organizer || !Tickets_Count || !Ticket_Price) {
        return res.status(400).json({ 
          error: "Missing required fields",
          missing: [
            !Event_Name && "Event_Name",
            !Event_Date && "Event_Date",
            !Venue_ID && "Venue_ID",
            !Event_Start_Time && "Event_Start_Time",
            !Event_End_Time && "Event_End_Time",
            !Organizer && "Organizer",
            !Tickets_Count && "Tickets_Count",
            !Ticket_Price && "Ticket_Price"
          ].filter(Boolean)
        });
      }

      // Convert to numbers
      const venueId = parseInt(Venue_ID);
      const tickets = parseInt(Tickets_Count);
      const price = parseInt(Ticket_Price);
      const availableTickets = parseInt(Available_Tickets);

      if (isNaN(venueId) || isNaN(tickets) || isNaN(price) || isNaN(availableTickets)) {
        return res.status(400).json({ error: "Invalid numeric values for Venue_ID, Tickets_Count, Ticket_Price, or Available_Tickets" });
      }

      eventsModel.createEvent(
        {
          Event_Name,
          Event_Date,
          Event_Start_Time,
          Event_End_Time,
          Venue_ID: venueId,
          Tickets_Count: tickets,
          Ticket_Price: price,
          Organizer,
          Available_Tickets: availableTickets
        },
        (err, result) => {
          if (err) {
            if (err.message === 'Event with the same name already exists') {
              return res.status(409).json({ error: err.message });
            }
            if (err.message === 'Venue is already booked!') {
              return res.status(409).json({ error: err.message });
            }
            console.error("Error creating event:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          res.status(201).json({ 
            message: 'Event added successfully',
            eventId: result.insertId 
          });
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

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
        if (err) {
          if (err.message === 'Venue with the same name already exists') {
            return res.status(409).json({ error: err.message });
          }
          console.error("Error creating venue:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json({ message: 'Venue added successfully' });
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

  updateOneEvent: (req, res) => {
  const { eventId } = req.params;
  const eventData = req.body;

  eventsModel.updateEvent(eventId, eventData, (err, result) => {
    if (err) {
      console.error('Error updating event:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'Event updated successfully' });
  });
},
updateVenue: (req, res) => {
  const { venueId } = req.params;
  const {
    Venue_Name,
    Street,
    City,
    District,
    State,
    Pincode,
    Capacity
  } = req.body;

  // Validate required fields
  if (!Venue_Name || !City || !Capacity) {
    return res.status(400).json({ 
      error: "Missing required fields",
      missing: [
        !Venue_Name && "Venue_Name",
        !City && "City",
        !Capacity && "Capacity"
      ].filter(Boolean)
    });
  }

  // Convert capacity to number
  const capacityNum = parseInt(Capacity);
  if (isNaN(capacityNum)) {
    return res.status(400).json({ error: "Capacity must be a number" });
  }

  eventsModel.updateVenue(
    venueId,
    {
      Venue_Name,
      Street,
      City,
      District,
      State,
      Pincode,
      Capacity: capacityNum
    },
    (err, result) => {
      if (err) {
        console.error('Error updating venue:', err);
        return res.status(500).json({ error: 'Failed to update venue' });
      }
      return res.status(200).json({ message: 'Venue updated successfully' });
    }
  );
},

  getAllVenues: (req, res) => {
  eventsModel.getAllVenues((err, result) => {
    if (err) {
      console.error("Error fetching venues:", err);
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
