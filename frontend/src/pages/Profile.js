import React, { useState, useEffect } from 'react';
import styles from "../styles/Profile.module.css";

import { useAuthContext } from "../hooks/useAuthContext";

const Profile = () => {
  const { user } = useAuthContext();
  const username = user.username;

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:4000/api/user/getUser/${username}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [username]);

  if (!userData) {
    return <p>Loading...</p>;
  }

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
    <div className={styles["profile-container"]}>
      <div className={styles["user-section"]}>
        <h1>User Details</h1>
        <div>
          <p>Name: {userData.Name}</p>
          <p>Username: {userData.Username}</p>
          <p>Email: {userData.Email}</p>
          <p>Mobile No.: {userData.ContactInfo}</p>
        </div>
      </div>

      <div className={styles["tickets-section"]}>
        <h1>Purchased Tickets</h1>
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
    </div>
  );
};

export default Profile;
