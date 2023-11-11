import React, { useState } from 'react';
import AddEventPopup from '../components/AddEventPopup';
import styles from "../styles/Events.module.css";

const Events = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleAddEventClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const tickets = [
    {
      id: 1,
      eventName: "Event 1",
      date: "2023-11-15",
      location: "Venue A",
      price: "100Rs",
    },
    {
      id: 2,
      eventName: "Event 2",
      date: "2023-11-20",
      location: "Venue B",
      price: "100Rs",
    },
  ];

  return (
    <div className={styles["events-container"]}>
      <div className={styles["events-section"]}>
        <h1>All Events</h1>
        <div className={styles["cards"]}>
          {tickets.map((ticket) => (
            <div className={styles["card"]} key={ticket.id}>
              <h3>{ticket.eventName}</h3>
              <div>
                <h5>Date: {ticket.date}</h5>
                <h5>Location: {ticket.location}</h5>
                <h5>Price: {ticket.price}</h5>
              </div>
              <button>Details</button>
            </div>
          ))}
        </div>
      </div>
      <div className={styles['add-button-section']}>
        <button onClick={handleAddEventClick}>Add New Event</button>
      </div>

      {/* Popup */}
      {showPopup && <AddEventPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default Events;
