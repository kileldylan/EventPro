import React, { useState } from "react";
import styles from "../styles/Popup.module.css";

const AddEventPopup = ({ onClose, venues }) => {
  const [isVisible, setIsVisible] = useState(true);

  const [EventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    venue: "",
    ticketsCount: 0,
    ticketPrice: 0,
    organizer: "",
  });

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(EventData);

    try {
      const response = await fetch(
        "http://localhost:4000/api/events/addEvent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(EventData),
        }
      );

      if (response.ok) {
        // const data = await response.json();
        // console.log("Event added successfully:", data);

        setEventData({
          eventName: "",
          eventDate: "",
          venue: "",
          ticketsCount: 0,
          ticketPrice: 0,
          organizer: "",
        });      
        
        handleClose();
      } else {
        const error = await response.json();
        console.error("Failed to add Event:", error);
      }
    } catch (error) {
      console.error("Error during event addition:", error);
    }
  };

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
            <form onSubmit={handleSubmit}>
              <label>
                Event Name:
                <input
                  type="text"
                  name="eventName"
                  value={EventData.eventName}
                  onChange={handleEventChange}
                  required
                />
              </label>
              <br />
              <label>
                Event Date:
                <input
                  type="date"
                  name="eventDate"
                  value={EventData.eventDate}
                  onChange={handleEventChange}
                  required
                />
              </label>
              <br />
              <label>
                Venue:
                <select
                  name="venue"
                  value={EventData.venue}
                  onChange={handleEventChange}
                  required
                >
                  <option value="" disabled>
                    Select Venue
                  </option>
                  {venues.map((venue) => (
                    <option key={venue.Venue_ID} value={venue.Venue_ID}>
                      {venue.Venue_Name}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <label>
                Tickets Count:
                <input
                  type="number"
                  name="ticketsCount"
                  value={EventData.ticketsCount}
                  onChange={handleEventChange}
                  required
                />
              </label>
              <br />
              <label>
                Tickets Price:
                <input
                  type="number"
                  name="ticketPrice"
                  value={EventData.ticketPrice}
                  onChange={handleEventChange}
                  required
                />
              </label>
              <br />
              <label>
                Organizer:
                <input
                  type="text"
                  name="organizer"
                  value={EventData.organizer}
                  onChange={handleEventChange}
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
