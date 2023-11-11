import React from 'react'
import styles from '../styles/Navbar.module.css';
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <div className={styles['navbar']}>
        <div><h1>Event Management System</h1></div>
        <ul>
            <li><Link to="/">Home</Link></li>
            { user && user.role === 1 && (<li><Link to="/dashboard">Dashboard</Link></li> )}
            { user && user.role === 1 && (<li><Link to="/events">Events</Link></li> )}
            { user && user.role === 1 && (<li><Link to="/venues">Venues</Link></li> )}
            { user && user.role === 2 && (<li><Link to="/events">Events</Link></li> )}
            { user && user.role === 2 && (<li><Link to="/profile">Profile</Link></li> )}
            {/* <li><Link to="/contact">Contact Us</Link></li> */}
            { !user && (<li><Link to="/authentication">Login/Signup</Link></li>)}
            { user && (<button className="logout-button" onClick={handleClick}>Log Out</button>)}
        </ul>
    </div>
  )
}

export default Navbar