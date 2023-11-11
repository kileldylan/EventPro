import React, { useState } from 'react';
import AddVenuePopup from '../components/AddVenuePopup';
import styles from "../styles/Venues.module.css";

const Events = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleAddVenueClick = () => {
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
    <div className={styles["venues-container"]}>
      <div className={styles["venues-section"]}>
        <h1>All Venues</h1>
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
      <div className={styles["add-button-section"]}>
        <button onClick={handleAddVenueClick}>Add New Venue</button>
      </div>

      {/* Popup */}
      {showPopup && <AddVenuePopup onClose={handleClosePopup} />}
    </div>
  );
};

export default Events;
