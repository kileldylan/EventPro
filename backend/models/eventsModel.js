const db = require('../db');

module.exports = {
  createVenue: (venueName, street, city, district, state, pincode, capacity, callback) => {
    const checkQuery = 'SELECT COUNT(*) AS count FROM Venues WHERE Venue_Name = ? AND Street = ? AND City = ?';
    
    db.query(checkQuery, [venueName, street, city], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking for duplicate venue:', checkErr);
        return callback(checkErr);
      }

      const venueCount = checkResults[0].count;

      if (venueCount > 0) {
        return callback({ message: 'Venue with the same name already exists' });
      }

      const insertQuery = 'INSERT INTO Venues (Venue_Name, Street, City, District, State, Pincode, Capacity) VALUES (?, ?, ?, ?, ?, ?, ?)';

      db.query(insertQuery, [venueName, street, city, district, state, pincode, capacity], callback);
    });
  },

  getAllVenues: (callback) => {
    const query = 'SELECT * from Venues';
    db.query(query,callback);
  },

  createEvent: (eventName, eventDate, venue, ticketsCount, ticketPrice, organizer, availabelTickets, callback) => {
    const checkQuery = 'SELECT COUNT(*) AS count FROM Events WHERE Event_Name = ? AND Event_Date = ? AND Venue_ID = ?';
    
    db.query(checkQuery, [eventName, eventDate,venue], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking for duplicate event:', checkErr);
        return callback(checkErr);
      }

      const eventCount = checkResults[0].count;

      if (eventCount > 0) {
        return callback({ message: 'Event with the same name already exists' });
      }

      const insertQuery = 'INSERT INTO Events (Event_Name, Event_Date, Organizer, Tickets_Count, Ticket_Price, Available_Tickets, Venue_ID) VALUES (?, ?, ?, ?, ?, ?, ?)';

      db.query(insertQuery, [eventName, eventDate, organizer, ticketsCount, ticketPrice, availabelTickets, venue], callback);
    });
  },

  getAllEvents: (callback) => {
    const query = 'SELECT * from Events';
    db.query(query,callback);
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