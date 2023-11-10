import React from 'react'
import styles from '../styles/Navbar.module.css';
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className={styles['navbar']}>
        <div><h1>Event Management System</h1></div>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/authentication">Login/Signup</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
        </ul>
    </div>
  )
}

export default Navbar