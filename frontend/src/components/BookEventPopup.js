import React, { useState, useEffect } from "react";
import styles from "../styles/Popup.module.css";

import { useAuthContext } from "../hooks/useAuthContext";

const BookEventPopup = ({ onClose, eventToBook }) => {
  const { user } = useAuthContext();
  const username = user.username;

  const [isVisible, setIsVisible] = useState(true);

  const [userData, setUserData] = useState(null);
  const [EventData, setEventData] = useState(null);
  const [VenueData, setVenueData] = useState(null);

  const [formValues, setFormValues] = useState({
    // userID: "",
    // eventID: "",
    numberOfTickets: "",
    paymentMethod: "",
    amount: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:4000/api/user/getUser/${username}`
        );
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [username]);

  const fetchVenueData = async (Venue_ID) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:4000/api/events/getVenue/${Venue_ID}`
      );
      const data = await response.json();
      setVenueData(data);
    } catch (error) {
      console.error("Error fetching venue data:", error);
    }
  };

  useEffect(() => {
    const fetchEventData = async (Event_ID) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:4000/api/events/getEvent/${Event_ID}`
        );
        const data = await response.json();
        setEventData(data);
        fetchVenueData(data.Venue_ID);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData(eventToBook);
  }, [eventToBook]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };

      if (name === "numberOfTickets") {
        updatedValues.amount =
          (parseInt(value) || 0) * (parseInt(EventData.Ticket_Price) || 0);
      }

      return updatedValues;
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if(EventData.Available_Tickets < formValues.numberOfTickets){
  //     console.log("These many tickets not available.");
  //     return;
  //   }

  //   formValues.userID = parseInt(userData.User_ID);
  //   formValues.eventID = parseInt(EventData.Event_ID);
  //   try {
  //     const response = await fetch(
  //       "http://localhost:4000/api/events/purchaseTicket",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(formValues),
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("Purchased successfully:", data);

  //       setFormValues({
  //         userID: "",
  //         eventID: "",
  //         numberOfTickets: "",
  //         paymentMethod: "",
  //         amount: 0,
  //       });

  //       handleClose();
  //     } else {
  //       const error = await response.json();
  //       console.error("Failed to purchase ticket:", error);
  //     }
  //   } catch (error) {
  //     console.error("Error during ticket purchase:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (EventData.Available_Tickets < formValues.numberOfTickets) {
      console.log("These many tickets not available.");
      return;
    }

    const requestBody1 = {
      userID: parseInt(userData.User_ID),
      eventID: parseInt(EventData.Event_ID),
    };

    formValues.userID = parseInt(userData.User_ID);
    formValues.eventID = parseInt(EventData.Event_ID);
    try {
      const response1 = await fetch(
        "http://localhost:4000/api/events/createBooking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody1),
        }
      );

      if (response1.ok) {
        const data1 = await response1.json();

        const requestBody2 = {
          eventID: parseInt(EventData.Event_ID),
          numberOfTickets: formValues.numberOfTickets,
        };

        const response2 = await fetch(
          "http://localhost:4000/api/events/createTickets",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody2),
          }
        );

        if (response2.ok) {
          const data2 = await response2.json();

          const requestBody3 = {
            bookingID: data1.bookingID,
            ticketIDs: data2.ticketIDs,
          };

          const response3 = await fetch(
            "http://localhost:4000/api/events/createBookingDetails",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody3),
            }
          );

          if (response3.ok) {
            const data3 = await response3.json();

            const requestBody4 = {
              eventID: parseInt(EventData.Event_ID),
              numberOfTickets: formValues.numberOfTickets,
            };

            const response4 = await fetch(
              "http://localhost:4000/api/events/updateAvailableTickets",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody4),
              }
            );

            if (response4.ok) {
              const data4 = await response4.json();

              const requestBody5 = {
                bookingID: data1.bookingID,
                paymentMethod: formValues.paymentMethod,
                amount: formValues.amount,
              };

              const response5 = await fetch(
                "http://localhost:4000/api/events/createPayment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(requestBody5),
                }
              );

              if (response5.ok) {
                const data = await response5.json();
                console.log("Purchased successfully:", data);

                setFormValues({
                  // userID: "",
                  // eventID: "",
                  numberOfTickets: "",
                  paymentMethod: "",
                  amount: 0,
                });

                handleClose();
              } else {
                const error = await response5.json();
                console.error("Failed to purchase ticket:", error);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error during ticket purchase:", error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!userData || !EventData || !VenueData) {
    return <p>Loading...</p>;
  }

  return (
    isVisible && (
      <div className={styles["popup-container"]}>
        <button className={styles["close-button"]} onClick={handleClose}>
          &#10006;
        </button>
        <div className={styles["popup-content"]}>
          <div className={styles["title"]}>
            <h1>Book Ticket</h1>
          </div>
          <div>
            <div>
              <h3>Event Details:</h3>
              <p>Event Name: {EventData.Event_Name}</p>
              <p>Event Date: {EventData.Event_Date}</p>
              <p>Event Organizer: {EventData.Organizer}</p>
              <p>Total Tickets Count: {EventData.Tickets_Count}</p>
              <p>Remaining Tickets Count: {EventData.Available_Tickets}</p>
            </div>
            <div>
              <h3>Your Details:</h3>
              <p>Name: {userData.Name}</p>
              <p>Email: {userData.Email}</p>
              <p>Mobile No.: {userData.ContactInfo}</p>
            </div>
            <div className={styles["form"]}>
              <h3>Payment Info:</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  Number of Tickets:
                  <input
                    type="number"
                    name="numberOfTickets"
                    value={formValues.numberOfTickets}
                    onChange={handleFormChange}
                    required={true}
                  />
                </label>
                <label>
                  Payment Method:
                  <select
                    name="paymentMethod"
                    value={formValues.paymentMethod}
                    onChange={handleFormChange}
                    required={true}
                  >
                    <option value="">Select Payment Method</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                  </select>
                </label>
                <label>
                  Amount:
                  <input
                    type="number"
                    name="amount"
                    disabled="true"
                    value={formValues.amount}
                    onChange={handleFormChange}
                    required={true}
                  />
                </label>
                <button type="submit">Proceed with Payment</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BookEventPopup;
