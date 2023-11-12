import React, { useState } from "react";
import styles from "../styles/Popup.module.css";

const AddVenuePopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const [VenueData, setVenueData] = useState({
    venueName: '',
      street: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      capacity: 0
  });

  const handleVenueChange = (e) => {
    const { name, value } = e.target;
    setVenueData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/events/addVenue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(VenueData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Venue added successfully:", data);

        setVenueData({
          venueName: '',
          street: '',
          city: '',
          district: '',
          state: '',
          pincode: '',
          capacity: 0
        });

        handleClose();
      } else {
        const error = await response.json();
        console.error("Failed to add venue:", error);
      }
    } catch (error) {
      console.error("Error during venue addition:", error);
    }
  }

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    isVisible && (
      <div className={styles["popup-container"]}>
        <button className={styles["close-button"]} onClick={handleClose}>
          &#10006;
        </button>
        <div className={styles["popup-content"]}>
          <div className={styles["title"]}>
            <h1>Add New Venue</h1>
          </div>
          <div className={styles["form"]}>
            <form onSubmit={handleSubmit}>
              <label>
                Venue Name:
                <input
                  type="text"
                  name="venueName"
                  value={VenueData.venueName}
                  onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
                Street:
                <input
                  type="text"
                  name="street"
                  value={VenueData.street}
                  onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={VenueData.city}
                  onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
                District:
                <input
                  type="text"
                  name="district"
                  value={VenueData.district}
                  onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
                State:
                <input
                  type="text"
                  name="state"
                  value={VenueData.state}
                  onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
              Pincode:
                <input
                  type="number"
                  name="pincode"
                  value={VenueData.pincode}
                  onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
                Capacity:
                <input
                  type="number"
                  name="capacity"
                  value={VenueData.capacity}
                  onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <button type="submit">Add Venue</button>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default AddVenuePopup;
