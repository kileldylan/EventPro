import React, { useState } from "react";
import styles from "../styles/Popup.module.css";

const AddVenuePopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

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
            <form>
              {/* Venue form */}
              <label>
                Venue Name:
                <input
                  type="text"
                  name="Venue_Name"
                  // value={VenueData.Venue_Name}
                  // onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
                Street:
                <input
                  type="text"
                  name="Street"
                  // value={VenueData.Street}
                  // onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
                City:
                <input
                  type="text"
                  name="City"
                  // value={VenueData.City}
                  // onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
                District:
                <input
                  type="text"
                  name="District"
                  // value={VenueData.District}
                  // onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
                State:
                <input
                  type="text"
                  name="State"
                  // value={VenueData.State}
                  // onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
              Pincode:
                <input
                  type="number"
                  name="Pincode"
                  // value={VenueData.Pincode}
                  // onChange={handleVenueChange}
                  required
                />
              </label>
              <br />
              <label>
                Capacity:
                <input
                  type="number"
                  name="Capacity"
                  // value={VenueData.Capacity}
                  // onChange={handleVenueChange}
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
