import React, { useState, useEffect } from 'react';
import AddEventPopup from '../components/AddEventPopup';
import styles from "../styles/Events.module.css";

const Events = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [EventsData, setEventsData] = useState([]);

  const handleAddEventClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const [venuesData, setVenuesData] = useState([]);

  useEffect(() => {
    const fetchVenuesData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:4000/api/events/getVenues`);
        const data = await response.json();
        setVenuesData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchVenuesData();
  }, []);


  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:4000/api/events/getEvents`);
        const data = await response.json();
        setEventsData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchEventsData();
  }, [showPopup]);

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://127.0.0.1:4000/api/events/deleteEvent/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedEvents = EventsData.filter((event) => event.Event_ID !== eventId);
        setEventsData(updatedEvents);
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error during event deletion:', error);
    }
  };

  const venueMap = venuesData.reduce((acc, venue) => {
    acc[venue.Venue_ID] = venue;
    return acc;
  }, {});

  return (
    <div className={styles["events-container"]}>
      <div className={styles["events-section"]}>
        <h1>All Events</h1>
        <div className={styles["cards"]}>
        {EventsData.map((Event) => (
            <div className={styles["card"]} key={Event.Event_ID}>
              <h3>{Event.Event_Name}</h3>
              <div>
                <h5>Date: {Event.Event_Date}</h5>
                <h5>Organizer: {Event.Organizer}</h5>
                <h5>Venue: {venueMap[Event.Venue_ID]?.Venue_Name}</h5>
                <h4>Address: {venueMap[Event.Venue_ID]?.Street + ", " + venueMap[Event.Venue_ID]?.City + ", " + venueMap[Event.Venue_ID]?.District + ", " + venueMap[Event.Venue_ID]?.State + ", " + venueMap[Event.Venue_ID]?.Pincode + "."}</h4>
                <h5>Tickets: {Event.Tickets_Count}</h5>
              </div>
              <button onClick={() => handleDeleteEvent(Event.Event_ID)}>Delete</button>
              <button>Details</button>
            </div>
          ))}
        </div>
      </div>
      <div className={styles['add-button-section']}>
        <button onClick={handleAddEventClick}>Add New Event</button>
      </div>

      {/* Popup */}
      {showPopup && <AddEventPopup onClose={handleClosePopup} venues={venuesData} />}
    </div>
  );
};

export default Events;