import React from 'react'
import styles from '../styles/Home.module.css';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className={styles['home-container']}>
      <h1>Welcome to Event Management System</h1>
      <Link to="/dashboard"><button>Get Started</button></Link>
    </div>
  )
}

export default Home