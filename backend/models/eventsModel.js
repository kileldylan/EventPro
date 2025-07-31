const db = require('../db');

module.exports = {
  createVenue: (venueName, street, city, district, state, pincode, capacity, callback) => {
    const checkQuery = 'SELECT COUNT(*) AS count FROM Venues WHERE Venue_Name = ? AND Street = ? AND City = ?';
    
    db.query(checkQuery, [venueName, street, city], (checkErr, checkResults) => {
      if (checkErr) return callback(checkErr);

      if (checkResults[0].count > 0) {
        return callback(new Error('Venue with the same name already exists'));
      }

      const insertQuery = 'INSERT INTO Venues (Venue_Name, Street, City, District, State, Pincode, Capacity) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [venueName, street, city, district, state, pincode, capacity], callback);
    });
  },

  getAllVenues: (callback) => {
    const query = 'SELECT * FROM Venues';
    db.query(query, callback);
  },

  createEvent: (eventData, callback) => {
    if (!eventData || typeof callback !== 'function') {
      return callback(new Error('Invalid parameters'));
    }

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
    } = eventData;

    // Check for duplicate events
    const checkQuery = 'SELECT COUNT(*) AS count FROM Events WHERE Event_Name = ? AND Event_Date = ? AND Venue_ID = ?';
    
    db.query(checkQuery, [Event_Name, Event_Date, Venue_ID], (checkErr, checkResults) => {
      if (checkErr) return callback(checkErr);

      if (checkResults[0].count > 0) {
        return callback(new Error('Event with the same name already exists'));
      }

      // Check for time slot availability
      const clashQuery = `
        SELECT COUNT(*) AS count FROM Events 
        WHERE Venue_ID = ? AND Event_Date = ? 
        AND ((Event_Start_Time < ? AND Event_End_Time > ?) 
        OR (Event_Start_Time >= ? AND Event_End_Time <= ?))
      `;

      db.query(clashQuery, 
        [Venue_ID, Event_Date, Event_End_Time, Event_Start_Time, Event_Start_Time, Event_End_Time],
        (clashErr, clashResults) => {
          if (clashErr) return callback(clashErr);

          if (clashResults[0].count > 0) {
            return callback(new Error('Venue is already booked!'));
          }

          // Insert the event
          const insertQuery = `
            INSERT INTO Events (
              Event_Name, Event_Date, Event_Start_Time, Event_End_Time,
              Organizer, Tickets_Count, Ticket_Price, Available_Tickets, Venue_ID
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          db.query(insertQuery, [
            Event_Name, Event_Date, Event_Start_Time, Event_End_Time,
            Organizer, Tickets_Count, Ticket_Price, Available_Tickets, Venue_ID
          ], callback);
        }
      );
    });
  },

  updateEvent: (eventId, eventData, callback) => {
    const { 
      Event_Name, 
      Event_Date, 
      Event_Start_Time, 
      Event_End_Time, 
      Organizer, 
      Tickets_Count, 
      Ticket_Price, 
      Available_Tickets, 
      Venue_ID 
    } = eventData;

    const query = `
      UPDATE Events 
      SET 
        Event_Name = ?,
        Event_Date = ?,
        Event_Start_Time = ?,
        Event_End_Time = ?,
        Organizer = ?,
        Tickets_Count = ?,
        Ticket_Price = ?,
        Available_Tickets = ?,
        Venue_ID = ?
      WHERE Event_ID = ?
    `;
    
    db.query(query, [
      Event_Name,
      Event_Date,
      Event_Start_Time,
      Event_End_Time,
      Organizer,
      Tickets_Count,
      Ticket_Price,
      Available_Tickets,
      Venue_ID,
      eventId
    ], callback);
  },

  getAllEvents: (callback) => {
    const query = 'SELECT * from Events';
    db.query(query, callback);
  },

  getOneEvent: (eventId, callback) => {
    const query = 'SELECT * from Events WHERE Event_ID = ?';
    db.query(query, [eventId], callback);
  },

  getOneVenue: (venueId, callback) => {
    const query = 'SELECT * from Venues WHERE Venue_ID = ?';
    db.query(query, [venueId], callback);
  },

  deleteEvent: (eventId, callback) => {
    const deleteQuery = 'DELETE FROM Events WHERE Event_ID = ?';
    db.query(deleteQuery, [eventId], callback);
  },
  
  deleteVenue: (venueId, callback) => {
    const deleteQuery = 'DELETE FROM Venues WHERE Venue_ID = ?';
    db.query(deleteQuery, [venueId], callback);
  }
};