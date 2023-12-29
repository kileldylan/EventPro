import React, { useState, useEffect } from 'react';
import styles from "../styles/Profile.module.css";
import QRCode from 'react-qr-code';

import { useAuthContext } from "../hooks/useAuthContext";

const Profile = () => {
  const { user } = useAuthContext();
  const username = user.username;

  const [userData, setUserData] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserTickets = async (userID) => {
    try {
      const response = await fetch(`http://127.0.0.1:4000/api/events/getTickets/${userID}`);
      const data = await response.json();
      setUserTickets(data.tickets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:4000/api/user/getUser/${username}`);
        const data = await response.json();
        setUserData(data);

        fetchUserTickets(data.User_ID);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [username]);

  if (!userData || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles["profile-container"]}>
      <div className={styles["user-section"]}>
        <h1>User Details</h1>
        <div>
          <p><span>Name:</span> {userData.Name}</p>
          <p><span>Username:</span> {userData.Username}</p>
          <p><span>Email:</span> {userData.Email}</p>
          <p><span>Mobile No.:</span> {userData.ContactInfo}</p>
        </div>
      </div>

      <div className={styles["tickets-section"]}>
        <h1>Purchased Tickets</h1>
        <div className={styles["cards"]}>
          {userTickets.map((ticket) => (
            <div className={styles["card"]} key={ticket.Ticket_ID}>
              <h3>{ticket.Event_Name}</h3>
              <div>
                <h5><span>Ticket ID:</span> {ticket.Ticket_ID}</h5>
                <h5><span>Date:</span> {ticket.Event_Date}</h5>
                <h5><span>Location:</span> {ticket.Venue_Name}</h5>
              </div>
              <QRCode value={`Event: ${ticket.Event_Name}\nDate: ${ticket.Event_Date}\nTime: ${ticket.Event_Start_Time} to ${ticket.Event_End_Time}\nEvent Organizer: ${ticket.Organizer}\nVenue Location: ${ticket.Venue_Name + ", " + ticket.Street + ", " + ticket.City + ", " + ticket.District + ", " + ticket.State + ", " + ticket.Pincode}\nPrice: Rs.${ticket.Ticket_Price}\nTicket ID: ${ticket.Ticket_ID}\nBooking ID: ${ticket.Booking_ID}\nBooking Date: ${ticket.Booking_Date}\nPayment Method: ${ticket.Payment_Method}\nAmount Paid: Rs.${ticket.Amount}\n`} className={styles["qr-code"]} />
              <p>Scan QR for Details</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
