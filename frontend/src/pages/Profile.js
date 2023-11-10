import React from "react";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  const user = {
    name: "Abhishek Shinde",
    username: "abhishinde",
    email: "abhishinde889@gmail.com",
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
    <div className={styles["profile-container"]}>
      <div className={styles["user-section"]}>
        <h1>User Details</h1>
        <div>
          <p>Name: {user.name}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
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
