import React, { useState } from "react";
import styles from "../styles/Popup.module.css";

const AddEventPopup = ({ onClose }) => {
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
            <h1>Add New Event</h1>
          </div>
          <div className={styles["form"]}>
            <form>
              {/* Event form */}
              <label>
                Event Name:
                <input
                  type="text"
                  name="Event_Name"
                  // value={eventData.Event_Name}
                  // onChange={handleEventChange}
                  required
                />
              </label>
              <br />
              <label>
                Event Start Date:
                <input
                  type="date"
                  name="Event_Date"
                  // value={eventData.Event_Date}
                  // onChange={handleEventChange}
                  required
                />
              </label>
              <br />
              <label>
                Event End Date:
                <input
                  type="date"
                  name="Event_Date"
                  // value={eventData.Event_Date}
                  // onChange={handleEventChange}
                  required
                />
              </label>
              <br />
              <label>
                Venue ID:
                {/* Dropdown menu for venue selection */}
                <select
                  name="Venue_ID"
                  // value={eventData.Venue_ID}
                  // onChange={handleEventChange}
                  required
                >
                  <option value="" disabled>
                    Select Venue
                  </option>
                  {/* Dynamically populate options based on available venues */}
                  {/* For simplicity, you can fetch the venue data from your backend and map over it */}
                  <option value="1">Venue 1</option>
                  <option value="2">Venue 2</option>
                  {/* Add more options as needed */}
                </select>
              </label>
              <br />
              <label>
                Tickets Count:
                <input
                  type="number"
                  name="Tickets_Count"
                  // value={eventData.Tickets_Count}
                  // onChange={handleEventChange}
                  required
                />
              </label>
              <br />
              <label>
                Organizer:
                <input
                  type="text"
                  name="Organizer"
                  // value={eventData.Organizer}
                  // onChange={handleEventChange}
                  required
                />
              </label>
              <br />
              <button type="submit">Add Event</button>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default AddEventPopup;
