import React, { useState, useEffect } from 'react';
import AddVenuePopup from '../components/AddVenuePopup';
import styles from "../styles/Venues.module.css";

const Venues = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleAddVenueClick = () => {
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
  }, [showPopup]);

  const handleDeleteVenue = async (venueId) => {
    try {
      const response = await fetch(`http://127.0.0.1:4000/api/events/deleteVenue/${venueId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedEvents = venuesData.filter((venue) => venue.Venue_ID !== venueId);
        setVenuesData(updatedEvents);
      } else {
        console.error('Failed to delete venue');
      }
    } catch (error) {
      console.error('Error during venue deletion:', error);
    }
  };

  return (
    <div className={styles["venues-container"]}>
      <div className={styles["venues-section"]}>
        <h1>All Venues</h1>
        <div className={styles["cards"]}>
        {venuesData.map((Venue,) => (
            <div className={styles["card"]} key={Venue.Venue_ID}>
              <h3>{Venue.Venue_Name}</h3>
              <div>
                <h5>Street: {Venue.Street}</h5>
                <h5>City: {Venue.City}</h5>
                <h5>District: {Venue.District}</h5>
                <h5>State: {Venue.State}</h5>
                <h5>Pincode: {Venue.Pincode}</h5>
                <h5>Capacity: {Venue.Capacity}</h5>
              </div>
              <button onClick={() => handleDeleteVenue(Venue.Venue_ID)}>Delete</button>
              <button>Details</button>
            </div>
          ))}
        </div>
      </div>
      <div className={styles["add-button-section"]}>
        <button onClick={handleAddVenueClick}>Add New Venue</button>
      </div>

      {showPopup && <AddVenuePopup onClose={handleClosePopup} />}
    </div>
  );
};

export default Venues;
